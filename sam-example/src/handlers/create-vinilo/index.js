const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { randomUUID } = require('crypto');

const ddbClient = new DynamoDBClient({ region: process.env.REGION });
const docClient = DynamoDBDocumentClient.from(ddbClient);

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
    console.log('Lambda invocada - POST vinilo');
    console.log('Event:', JSON.stringify(event, null, 2));
    
    try {
        // Parse body
        let body;
        try {
            body = JSON.parse(event.body || '{}');
        } catch (error) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    error: 'JSON inválido',
                    mensaje: 'El body debe ser JSON válido'
                })
            };
        }

        // Validate required fields
        const errors = [];
        if (!body.titulo || body.titulo.trim() === '') {
            errors.push('titulo es requerido');
        }
        if (!body.artista || body.artista.trim() === '') {
            errors.push('artista es requerido');
        }
        if (!body.precio || isNaN(parseFloat(body.precio))) {
            errors.push('precio es requerido y debe ser un número');
        }

        if (errors.length > 0) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    error: 'Validación fallida',
                    errores: errors
                })
            };
        }

        // Create vinyl object
        const vinilo = {
            id: body.id || randomUUID(),
            titulo: body.titulo.trim(),
            artista: body.artista.trim(),
            precio: parseFloat(body.precio),
            anio: body.anio ? parseInt(body.anio) : null,
            genero: body.genero || null,
            imagen_key: body.imagen_key || 'placeholder.jpg',
            created_at: new Date().toISOString()
        };

        // Check if ID already exists
        if (body.id) {
            const checkParams = {
                TableName: TABLE_NAME,
                Key: { id: body.id }
            };

            const existing = await docClient.send(new GetCommand(checkParams));
            if (existing.Item) {
                return {
                    statusCode: 409,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({
                        error: 'Vinilo ya existe',
                        mensaje: `Ya existe un vinilo con ID: ${body.id}`
                    })
                };
            }
        }

        // Insert into DynamoDB
        const params = {
            TableName: TABLE_NAME,
            Item: vinilo,
            ConditionExpression: 'attribute_not_exists(id)'
        };

        await docClient.send(new PutCommand(params));

        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                mensaje: 'Vinilo creado correctamente',
                vinilo: vinilo
            })
        };

    } catch (error) {
        console.error('Error al crear vinilo:', error);
        
        if (error.name === 'ConditionalCheckFailedException') {
            return {
                statusCode: 409,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    error: 'Vinilo ya existe',
                    mensaje: 'Ya existe un vinilo con ese ID'
                })
            };
        }

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Error al crear vinilo',
                mensaje: error.message
            })
        };
    }
};
