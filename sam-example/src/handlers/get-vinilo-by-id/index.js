const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const docClient = DynamoDBDocumentClient.from(ddbClient);

const TABLE_NAME = process.env.TABLE_NAME;
const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.REGION;

exports.handler = async (event) => {
    console.log('Lambda invocada - GET vinilo by ID');
    
    try {
        const id = event.pathParameters?.id;
        
        if (!id) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    error: 'ID requerido',
                    mensaje: 'Debes proporcionar un ID en la ruta'
                })
            };
        }

        const params = {
            TableName: TABLE_NAME,
            Key: { id: id }
        };

        const result = await docClient.send(new GetCommand(params));
        
        if (!result.Item) {
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    error: 'Vinilo no encontrado',
                    mensaje: `No existe vinilo con ID: ${id}`
                })
            };
        }

        const s3BaseUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com`;
        const vinilo = {
            ...result.Item,
            imagen: `${s3BaseUrl}/${result.Item.imagen_key || 'placeholder.jpg'}`
        };

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ vinilo: vinilo })
        };

    } catch (error) {
        console.error('Error al obtener vinilo:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Error al obtener vinilo',
                mensaje: error.message,
                tipo: error.name
            })
        };
    }
};
