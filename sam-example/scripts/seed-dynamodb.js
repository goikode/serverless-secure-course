#!/usr/bin/env node
/**
 * Seed DynamoDB Script
 *
 * Populates the vinilos table with initial data (5 vinyl records)
 *
 * Usage:
 *   node scripts/seed-dynamodb.js <table-name>
 *
 * Example:
 *   node scripts/seed-dynamodb.js juan-perez-a7b3f-vinilos
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

// Get table name from command line argument
const TABLE_NAME = process.argv[2];
if (!TABLE_NAME) {
    console.error('❌ Error: Debes proporcionar el nombre de la tabla');
    console.log('');
    console.log('Uso: node scripts/seed-dynamodb.js <table-name>');
    console.log('');
    console.log('Ejemplo: node scripts/seed-dynamodb.js juan-perez-a7b3f-vinilos');
    process.exit(1);
}

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

// Initial vinyl catalog data
const vinilos = [
    {
        id: '1',
        titulo: 'Abbey Road',
        artista: 'The Beatles',
        precio: 25.99,
        año: 1969,
        imagen_key: 'abbey-road.jpg'
    },
    {
        id: '2',
        titulo: 'Dark Side of the Moon',
        artista: 'Pink Floyd',
        precio: 22.50,
        año: 1973,
        imagen_key: 'dark-side.jpg'
    },
    {
        id: '3',
        titulo: 'Thriller',
        artista: 'Michael Jackson',
        precio: 19.99,
        año: 1982,
        imagen_key: 'thriller.jpg'
    },
    {
        id: '4',
        titulo: 'Songs of Leonard Cohen',
        artista: 'Leonard Cohen',
        precio: 23.50,
        año: 1967,
        imagen_key: 'leonard-cohen.jpg'
    },
    {
        id: '5',
        titulo: 'Naturally (Shades)',
        artista: 'J.J. Cale',
        precio: 21.99,
        año: 1971,
        imagen_key: 'jj-cale.jpg'
    }
];

/**
 * Seed DynamoDB table with vinyl catalog
 */
async function seedTable() {
    console.log('🌱 Iniciando seed de DynamoDB...');
    console.log(`📋 Tabla: ${TABLE_NAME}`);
    console.log('');

    let successCount = 0;
    let errorCount = 0;

    for (const vinilo of vinilos) {
        try {
            const params = {
                TableName: TABLE_NAME,
                Item: vinilo
            };

            await docClient.send(new PutCommand(params));
            console.log(`✅ Insertado: ${vinilo.titulo} - ${vinilo.artista}`);
            successCount++;

        } catch (error) {
            console.error(`❌ Error al insertar ${vinilo.titulo}:`, error.message);
            errorCount++;
        }
    }

    console.log('');
    console.log('📊 Resumen:');
    console.log(`  ✅ Insertados: ${successCount}`);
    console.log(`  ❌ Errores: ${errorCount}`);
    console.log('');

    if (errorCount === 0) {
        console.log('🎉 Seed completado exitosamente!');
    } else {
        console.log('⚠️  Seed completado con errores');
        process.exit(1);
    }
}

// Execute seed
seedTable().catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
});
