const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

// Configuration - Set these in Azure Function App Settings
const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME || 'harambeedata';
const STORAGE_ACCOUNT_KEY = process.env.STORAGE_ACCOUNT_KEY;
const CONTAINER_NAME = process.env.CONTAINER_NAME || 'board-data';
const BLOB_NAME = process.env.NAMING_OPPORTUNITIES_BLOB_NAME || 'naming-opportunities.json';

// Initialize Blob Service Client
let blobServiceClient;
if (STORAGE_ACCOUNT_KEY) {
    const sharedKeyCredential = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY);
    blobServiceClient = new BlobServiceClient(
        `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
        sharedKeyCredential
    );
}

module.exports = async function (context, req) {
    context.log('Naming Opportunities API function processed a request.');

    // Enable CORS
    context.res = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Content-Type': 'application/json'
        }
    };

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        context.res.status = 200;
        context.res.body = '';
        return;
    }

    try {
        // Check if storage is configured
        if (!STORAGE_ACCOUNT_KEY) {
            context.res.status = 500;
            context.res.body = { error: 'Storage account not configured. Please set STORAGE_ACCOUNT_KEY in app settings.' };
            return;
        }

        const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
        const blobClient = containerClient.getBlobClient(BLOB_NAME);

        switch (req.method) {
            case 'GET':
                await handleGet(context, blobClient, req.params.id);
                break;
            case 'POST':
                await handlePost(context, blobClient, req.body);
                break;
            case 'PUT':
                await handlePut(context, blobClient, req.params.id, req.body);
                break;
            case 'DELETE':
                await handleDelete(context, blobClient, req.params.id);
                break;
            default:
                context.res.status = 405;
                context.res.body = { error: 'Method not allowed' };
        }
    } catch (error) {
        context.log.error('Error processing request:', error);
        context.res.status = 500;
        context.res.body = { error: 'Internal server error' };
    }
};

// GET: Retrieve all opportunities or a specific one
async function handleGet(context, blobClient, opportunityId) {
    try {
        const downloadResponse = await blobClient.download();
        const content = await streamToBuffer(downloadResponse.readableStreamBody);
        const opportunities = JSON.parse(content.toString());

        if (opportunityId) {
            const opportunity = opportunities.find(o => o.id === parseInt(opportunityId));
            if (!opportunity) {
                context.res.status = 404;
                context.res.body = { error: 'Naming opportunity not found' };
                return;
            }
            context.res.body = opportunity;
        } else {
            // Sort opportunities by amount (highest first)
            const sortedOpportunities = opportunities.sort((a, b) => {
                // Extract numeric value from amount string (e.g., "$10M" -> 10000000)
                const getNumericValue = (amount) => {
                    const numStr = amount.replace(/[$,]/g, '');
                    let multiplier = 1;
                    
                    if (numStr.includes('M')) {
                        multiplier = 1000000;
                    } else if (numStr.includes('K')) {
                        multiplier = 1000;
                    }
                    
                    const baseNumber = parseFloat(numStr.replace(/[MK]/g, ''));
                    return baseNumber * multiplier;
                };
                
                return getNumericValue(b.amount) - getNumericValue(a.amount);
            });
            
            context.res.body = sortedOpportunities;
        }
    } catch (error) {
        if (error.statusCode === 404) {
            // Blob doesn't exist, return empty array
            context.res.body = [];
        } else {
            throw error;
        }
    }
}

// POST: Add new naming opportunity
async function handlePost(context, blobClient, newOpportunity) {
    if (!newOpportunity || !newOpportunity.amount || !newOpportunity.label) {
        context.res.status = 400;
        context.res.body = { error: 'Amount and label are required' };
        return;
    }

    // Get current opportunities
    let opportunities = [];
    try {
        const downloadResponse = await blobClient.download();
        const content = await streamToBuffer(downloadResponse.readableStreamBody);
        opportunities = JSON.parse(content.toString());
    } catch (error) {
        if (error.statusCode !== 404) {
            throw error;
        }
        // If blob doesn't exist, start with empty array
    }

    // Generate new ID
    const existingIds = opportunities.map(o => {
        if (typeof o.id === 'string' && o.id.startsWith('opportunity-')) {
            return parseInt(o.id.replace('opportunity-', ''));
        } else if (typeof o.id === 'number') {
            return o.id;
        }
        return 0;
    }).filter(id => !isNaN(id));
    
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    
    // Add new opportunity
    const opportunityToAdd = {
        id: newId,
        amount: newOpportunity.amount.trim(),
        label: newOpportunity.label.trim(),
        description: newOpportunity.description ? newOpportunity.description.trim() : '',
        available: newOpportunity.available !== undefined ? newOpportunity.available : true
    };
    
    opportunities.push(opportunityToAdd);

    // Save back to blob
    const jsonContent = JSON.stringify(opportunities, null, 2);
    const blockBlobClient = blobClient.getBlockBlobClient();
    await blockBlobClient.upload(jsonContent, jsonContent.length, {
        blobHTTPHeaders: {
            blobContentType: 'application/json'
        }
    });

    context.res.status = 201;
    context.res.body = opportunityToAdd;
}

// PUT: Update existing naming opportunity
async function handlePut(context, blobClient, opportunityId, updatedOpportunity) {
    if (!opportunityId) {
        context.res.status = 400;
        context.res.body = { error: 'Opportunity ID is required' };
        return;
    }

    if (!updatedOpportunity || !updatedOpportunity.amount || !updatedOpportunity.label) {
        context.res.status = 400;
        context.res.body = { error: 'Amount and label are required' };
        return;
    }

    try {
        const downloadResponse = await blobClient.download();
        const content = await streamToBuffer(downloadResponse.readableStreamBody);
        let opportunities = JSON.parse(content.toString());

        const opportunityIndex = opportunities.findIndex(o => o.id === parseInt(opportunityId));
        if (opportunityIndex === -1) {
            context.res.status = 404;
            context.res.body = { error: 'Naming opportunity not found' };
            return;
        }

        // Update the opportunity
        opportunities[opportunityIndex] = {
            id: parseInt(opportunityId),
            amount: updatedOpportunity.amount.trim(),
            label: updatedOpportunity.label.trim(),
            description: updatedOpportunity.description ? updatedOpportunity.description.trim() : '',
            available: updatedOpportunity.available !== undefined ? updatedOpportunity.available : true
        };

        // Save back to blob
        const jsonContent = JSON.stringify(opportunities, null, 2);
        const blockBlobClient = blobClient.getBlockBlobClient();
        await blockBlobClient.upload(jsonContent, jsonContent.length, {
            blobHTTPHeaders: {
                blobContentType: 'application/json'
            }
        });

        context.res.body = opportunities[opportunityIndex];
    } catch (error) {
        if (error.statusCode === 404) {
            context.res.status = 404;
            context.res.body = { error: 'No naming opportunities found' };
        } else {
            throw error;
        }
    }
}

// DELETE: Remove naming opportunity
async function handleDelete(context, blobClient, opportunityId) {
    if (!opportunityId) {
        context.res.status = 400;
        context.res.body = { error: 'Opportunity ID is required' };
        return;
    }

    try {
        const downloadResponse = await blobClient.download();
        const content = await streamToBuffer(downloadResponse.readableStreamBody);
        let opportunities = JSON.parse(content.toString());

        const opportunityIndex = opportunities.findIndex(o => o.id === parseInt(opportunityId));
        if (opportunityIndex === -1) {
            context.res.status = 404;
            context.res.body = { error: 'Naming opportunity not found' };
            return;
        }

        // Remove the opportunity
        const deletedOpportunity = opportunities.splice(opportunityIndex, 1)[0];

        // Save back to blob
        const jsonContent = JSON.stringify(opportunities, null, 2);
        const blockBlobClient = blobClient.getBlockBlobClient();
        await blockBlobClient.upload(jsonContent, jsonContent.length, {
            blobHTTPHeaders: {
                blobContentType: 'application/json'
            }
        });

        context.res.body = { message: 'Naming opportunity deleted successfully', deleted: deletedOpportunity };
    } catch (error) {
        if (error.statusCode === 404) {
            context.res.status = 404;
            context.res.body = { error: 'No naming opportunities found' };
        } else {
            throw error;
        }
    }
}

// Helper function to convert stream to buffer
async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on('data', (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on('error', reject);
    });
}