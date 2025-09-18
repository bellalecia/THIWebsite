const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

// Configuration - Set these in Azure Function App Settings
const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME || 'harambeedata';
const STORAGE_ACCOUNT_KEY = process.env.STORAGE_ACCOUNT_KEY;
const CONTAINER_NAME = process.env.CONTAINER_NAME || 'board-data';
const BLOB_NAME = process.env.IMPACT_GOALS_BLOB_NAME || 'impact-goals-data.json';

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
    context.log('Impact Goals API function processed a request.');

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

// GET: Retrieve all impact goals or a specific one
async function handleGet(context, blobClient, goalId) {
    try {
        const downloadResponse = await blobClient.download();
        const content = await streamToBuffer(downloadResponse.readableStreamBody);
        const goals = JSON.parse(content.toString());

        if (goalId) {
            const goal = goals.find(g => g.id === parseInt(goalId));
            if (!goal) {
                context.res.status = 404;
                context.res.body = { error: 'Impact goal not found' };
                return;
            }
            context.res.body = goal;
        } else {
            context.res.body = goals;
        }
    } catch (error) {
        if (error.statusCode === 404) {
            // Blob doesn't exist, create with default data
            const defaultGoals = [
                { id: 1, number: "500+", label: "Families to Receive Monthly Food Support" },
                { id: 2, number: "$10M", label: "Campaign Goal" },
                { id: 3, number: "200+", label: "Youth to Engage in STEAM Learning Annually" },
                { id: 4, number: "500+", label: "Adults to Gain Career-Ready Skills" }
            ];
            
            // Save default data to blob
            const jsonContent = JSON.stringify(defaultGoals, null, 2);
            const blockBlobClient = blobClient.getBlockBlobClient();
            await blockBlobClient.upload(jsonContent, jsonContent.length, {
                blobHTTPHeaders: {
                    blobContentType: 'application/json'
                }
            });
            
            context.res.body = defaultGoals;
        } else {
            throw error;
        }
    }
}

// POST: Add new impact goal
async function handlePost(context, blobClient, newGoal) {
    if (!newGoal || !newGoal.number || !newGoal.label) {
        context.res.status = 400;
        context.res.body = { error: 'Number and label are required' };
        return;
    }

    // Get current goals
    let goals = [];
    try {
        const downloadResponse = await blobClient.download();
        const content = await streamToBuffer(downloadResponse.readableStreamBody);
        goals = JSON.parse(content.toString());
    } catch (error) {
        if (error.statusCode !== 404) {
            throw error;
        }
        // If blob doesn't exist, start with empty array
    }

    // Generate new ID
    const existingIds = goals.map(g => g.id).filter(id => !isNaN(id));
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    
    // Add new goal
    const goalToAdd = {
        id: newId,
        number: newGoal.number.trim(),
        label: newGoal.label.trim()
    };
    
    goals.push(goalToAdd);

    // Save back to blob
    const jsonContent = JSON.stringify(goals, null, 2);
    const blockBlobClient = blobClient.getBlockBlobClient();
    await blockBlobClient.upload(jsonContent, jsonContent.length, {
        blobHTTPHeaders: {
            blobContentType: 'application/json'
        }
    });

    context.res.status = 201;
    context.res.body = goalToAdd;
}

// PUT: Update existing impact goal
async function handlePut(context, blobClient, goalId, updatedGoal) {
    if (!goalId) {
        context.res.status = 400;
        context.res.body = { error: 'Goal ID is required' };
        return;
    }

    if (!updatedGoal || !updatedGoal.number || !updatedGoal.label) {
        context.res.status = 400;
        context.res.body = { error: 'Number and label are required' };
        return;
    }

    try {
        const downloadResponse = await blobClient.download();
        const content = await streamToBuffer(downloadResponse.readableStreamBody);
        let goals = JSON.parse(content.toString());

        const goalIndex = goals.findIndex(g => g.id === parseInt(goalId));
        if (goalIndex === -1) {
            context.res.status = 404;
            context.res.body = { error: 'Impact goal not found' };
            return;
        }

        // Update the goal
        goals[goalIndex] = {
            id: parseInt(goalId),
            number: updatedGoal.number.trim(),
            label: updatedGoal.label.trim()
        };

        // Save back to blob
        const jsonContent = JSON.stringify(goals, null, 2);
        const blockBlobClient = blobClient.getBlockBlobClient();
        await blockBlobClient.upload(jsonContent, jsonContent.length, {
            blobHTTPHeaders: {
                blobContentType: 'application/json'
            }
        });

        context.res.body = goals[goalIndex];
    } catch (error) {
        if (error.statusCode === 404) {
            context.res.status = 404;
            context.res.body = { error: 'No impact goals found' };
        } else {
            throw error;
        }
    }
}

// DELETE: Remove impact goal
async function handleDelete(context, blobClient, goalId) {
    if (!goalId) {
        context.res.status = 400;
        context.res.body = { error: 'Goal ID is required' };
        return;
    }

    try {
        const downloadResponse = await blobClient.download();
        const content = await streamToBuffer(downloadResponse.readableStreamBody);
        let goals = JSON.parse(content.toString());

        const goalIndex = goals.findIndex(g => g.id === parseInt(goalId));
        if (goalIndex === -1) {
            context.res.status = 404;
            context.res.body = { error: 'Impact goal not found' };
            return;
        }

        // Remove the goal
        const deletedGoal = goals.splice(goalIndex, 1)[0];

        // Save back to blob
        const jsonContent = JSON.stringify(goals, null, 2);
        const blockBlobClient = blobClient.getBlockBlobClient();
        await blockBlobClient.upload(jsonContent, jsonContent.length, {
            blobHTTPHeaders: {
                blobContentType: 'application/json'
            }
        });

        context.res.body = { message: 'Impact goal deleted successfully', deleted: deletedGoal };
    } catch (error) {
        if (error.statusCode === 404) {
            context.res.status = 404;
            context.res.body = { error: 'No impact goals found' };
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