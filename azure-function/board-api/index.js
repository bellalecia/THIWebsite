const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

// Configuration - Set these in Azure Function App Settings
const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME || 'harambeedata';
const STORAGE_ACCOUNT_KEY = process.env.STORAGE_ACCOUNT_KEY;
const CONTAINER_NAME = process.env.CONTAINER_NAME || 'board-data';
const BLOB_NAME = process.env.BLOB_NAME || 'board-data.json';

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
    context.log('Board API function processed a request.');

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
        context.log.error('Error:', error);
        context.res.status = 500;
        context.res.body = { 
            error: 'Internal server error', 
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
    }
};

// GET: Retrieve all members or specific member
async function handleGet(context, blobClient, memberId) {
    try {
        const downloadResponse = await blobClient.download();
        const content = await streamToBuffer(downloadResponse.readableStreamBody);
        const members = JSON.parse(content.toString());

        if (memberId) {
            const member = members.find(m => m.id === parseInt(memberId));
            if (!member) {
                context.res.status = 404;
                context.res.body = { error: 'Member not found' };
                return;
            }
            context.res.body = member;
        } else {
            context.res.body = members;
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

// POST: Add new member
async function handlePost(context, blobClient, newMember) {
    if (!newMember || !newMember.name || !newMember.title) {
        context.res.status = 400;
        context.res.body = { error: 'Name and title are required' };
        return;
    }

    // Get current members
    let members = [];
    try {
        const downloadResponse = await blobClient.download();
        const content = await streamToBuffer(downloadResponse.readableStreamBody);
        members = JSON.parse(content.toString());
    } catch (error) {
        if (error.statusCode !== 404) {
            throw error;
        }
        // If blob doesn't exist, start with empty array
    }

    // Generate new ID
    const existingIds = members.map(m => {
        if (typeof m.id === 'string' && m.id.startsWith('member-')) {
            return parseInt(m.id.replace('member-', ''));
        } else if (typeof m.id === 'number') {
            return m.id;
        }
        return 0;
    }).filter(id => !isNaN(id));
    
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    
    // Add new member
    const memberToAdd = {
        id: newId,
        name: newMember.name.trim(),
        title: newMember.title.trim()
    };
    
    members.push(memberToAdd);

    // Save back to blob
    const jsonContent = JSON.stringify(members, null, 2);
    const blockBlobClient = blobClient.getBlockBlobClient();
    await blockBlobClient.upload(jsonContent, jsonContent.length, {
        blobHTTPHeaders: { blobContentType: 'application/json' }
    });

    context.res.status = 201;
    context.res.body = memberToAdd;
}

// PUT: Update existing member
async function handlePut(context, blobClient, memberId, updatedData) {
    if (!memberId) {
        context.res.status = 400;
        context.res.body = { error: 'Member ID is required' };
        return;
    }

    if (!updatedData || !updatedData.name || !updatedData.title) {
        context.res.status = 400;
        context.res.body = { error: 'Name and title are required' };
        return;
    }

    try {
        // Get current members
        const downloadResponse = await blobClient.download();
        const content = await streamToBuffer(downloadResponse.readableStreamBody);
        const members = JSON.parse(content.toString());

        // Find and update member
        const memberIndex = members.findIndex(m => m.id === parseInt(memberId));
        if (memberIndex === -1) {
            context.res.status = 404;
            context.res.body = { error: 'Member not found' };
            return;
        }

        members[memberIndex] = {
            ...members[memberIndex],
            name: updatedData.name.trim(),
            title: updatedData.title.trim()
        };

        // Save back to blob
        const jsonContent = JSON.stringify(members, null, 2);
        const blockBlobClient = blobClient.getBlockBlobClient();
        await blockBlobClient.upload(jsonContent, jsonContent.length, {
            blobHTTPHeaders: { blobContentType: 'application/json' }
        });

        context.res.body = members[memberIndex];
    } catch (error) {
        if (error.statusCode === 404) {
            context.res.status = 404;
            context.res.body = { error: 'No members found' };
        } else {
            throw error;
        }
    }
}

// DELETE: Remove member
async function handleDelete(context, blobClient, memberId) {
    if (!memberId) {
        context.res.status = 400;
        context.res.body = { error: 'Member ID is required' };
        return;
    }

    try {
        // Get current members
        const downloadResponse = await blobClient.download();
        const content = await streamToBuffer(downloadResponse.readableStreamBody);
        const members = JSON.parse(content.toString());

        // Find member to delete
        const memberIndex = members.findIndex(m => m.id === parseInt(memberId));
        if (memberIndex === -1) {
            context.res.status = 404;
            context.res.body = { error: 'Member not found' };
            return;
        }

        const deletedMember = members[memberIndex];
        members.splice(memberIndex, 1);

        // Save back to blob
        const jsonContent = JSON.stringify(members, null, 2);
        const blockBlobClient = blobClient.getBlockBlobClient();
        await blockBlobClient.upload(jsonContent, jsonContent.length, {
            blobHTTPHeaders: { blobContentType: 'application/json' }
        });

        context.res.body = { 
            message: 'Member deleted successfully', 
            deletedMember: deletedMember 
        };
    } catch (error) {
        if (error.statusCode === 404) {
            context.res.status = 404;
            context.res.body = { error: 'No members found' };
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