module.exports = async function (context, req) {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        context.res = {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        };
        return;
    }

    try {
        // Get password from request body
        const { password } = req.body;

        if (!password) {
            context.res = {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: {
                    success: false,
                    message: 'Password is required'
                }
            };
            return;
        }

        // Get admin password from environment variables
        const adminPassword = process.env["ADMIN_PASSWORD"] || "12345";

        // Check password
        if (password === adminPassword) {
            context.res = {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: {
                    success: true,
                    message: 'Authentication successful'
                }
            };
        } else {
            context.res = {
                status: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: {
                    success: false,
                    message: 'Invalid password'
                }
            };
        }
    } catch (error) {
        context.log.error('Authentication error:', error);
        
        context.res = {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: {
                success: false,
                message: 'Internal server error'
            }
        };
    }
};