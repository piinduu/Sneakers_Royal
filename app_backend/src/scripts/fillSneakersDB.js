const SneaksAPI = require('sneaks-api');
const sneaks = new SneaksAPI();
const pool = require('../config/db');

// Función para insertar zapatillas en la base de datos
const insertSneaker = async (sneaker) => {
    try {
        const { styleID, shoeName, colorway, retailPrice, releaseDate, thumbnail } = sneaker;
        await pool.query(
            'INSERT INTO snkrs (style_id, name, colorway, description, release_date, retail_price, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (style_id) DO NOTHING',
            [styleID, shoeName, colorway, 'N/A', releaseDate || null, retailPrice || 0, thumbnail]
        );
        console.log(`Zapatilla insertada: ${shoeName}`);
    } catch (error) {
        console.error(`Error al insertar ${sneaker.shoeName}:`, error);
    }
};

// Función para obtener y poblar zapatillas
const populateSneakers = async () => {
    try {
        console.log('Comenzando la inserción de zapatillas...');
        sneaks.getMostPopular(100, async (err, sneakers) => {
            if (err) {
                console.error('Error al obtener zapatillas de Sneaks API:', err);
                return;
            }

            for (const sneaker of sneakers) {
                await insertSneaker(sneaker);
            }
            console.log('Inserción de zapatillas completada.');
            pool.end(); // Cierra la conexión con la base de datos
        });
    } catch (error) {
        console.error('Error general:', error);
        pool.end(); // Cierra la conexión con la base de datos
    }
};

populateSneakers();
