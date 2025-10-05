/**
 * Get Vinilos Handler
 *
 * Returns vinyl catalog from DynamoDB with S3 image URLs
 *
 * Architecture:
 * Client → API Gateway → Lambda → DynamoDB (read) + S3 (image URLs)
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

// Initialize DynamoDB Document Client (AWS SDK v3)
const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const docClient = DynamoDBDocumentClient.from(ddbClient);

// Environment variables (injected by SAM template)
const TABLE_NAME = process.env.TABLE_NAME;
const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.REGION;

/**
 * Lambda handler
 *
 * @param {Object} event - API Gateway HTTP API event
 * @returns {Object} HTTP response with statusCode, headers, body
 */
exports.handler = async (event) => {
    console.log('Lambda invocada - GET vinilos');
    console.log('Event:', JSON.stringify(event, null, 2));

    try {
        // Scan DynamoDB table to get all vinilos
        const params = {
            TableName: TABLE_NAME,
        };

        console.log('Scanning DynamoDB table:', TABLE_NAME);
        const result = await docClient.send(new ScanCommand(params));
        console.log('DynamoDB Scan result:', result.Count, 'items found');

        // Build S3 base URL for images
        const s3BaseUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com`;

        // Enrich vinilos with complete S3 image URLs
        const vinilos = result.Items.map(vinilo => ({
            ...vinilo,
            imagen: `${s3BaseUrl}/${vinilo.imagen_key || 'placeholder.jpg'}`
        }));

        // Sort by id (optional, for consistency)
        vinilos.sort((a, b) => a.id.localeCompare(b.id));

        // Return successful response
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                // CORS headers (also configured in API Gateway, but can add here too)
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
            },
            body: JSON.stringify({
                mensaje: 'Catálogo de vinilos desde DynamoDB (SAM deployment)',
                total: vinilos.length,
                vinilos: vinilos,
                metadata: {
                    table: TABLE_NAME,
                    bucket: BUCKET_NAME,
                    region: REGION
                }
            })
        };

    } catch (error) {
        console.error('Error al obtener vinilos:', error);

        // Return error response
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Error al obtener catálogo de vinilos',
                mensaje: error.message,
                tipo: error.name
            })
        };
    }
};
