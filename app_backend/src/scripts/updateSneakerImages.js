const fetch = require('node-fetch');
const pool = require('../config/db');

// Configura tus credenciales de la API
const API_KEY = 'AIzaSyAEMWLUylrTtFw_Ietcm0c0JhoGBHxN0Is';
const CX = 'c15255cdc0e6a44d1';

// Función para buscar imágenes usando Google Custom Search API
const searchImage = async (query) => {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
        query
    )}&searchType=image&key=${API_KEY}&cx=${CX}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            return data.items[0].link; // Retorna la URL de la primera imagen
        } else {
            console.log(`No se encontraron imágenes para: ${query}`);
            return 'https://via.placeholder.com/150'; // Placeholder si no encuentra nada
        }
    } catch (error) {
        console.error(`Error al buscar imagen para: ${query}`, error);
        return 'https://via.placeholder.com/150';
    }
};

// Función para actualizar las imágenes en la base de datos
const updateSneakerImages = async () => {
    const sneakers = await pool.query(
        "SELECT id, name, colorway FROM snkrs WHERE image_url = 'https://via.placeholder.com/150'"
    );

    for (const sneaker of sneakers.rows) {
        const { id, name, colorway } = sneaker;
        const query = `${name} ${colorway}`; // Combina el nombre y el colorway
        console.log(`Buscando imagen para: ${query}`);
        const imageUrl = await searchImage(query);

        try {
            await pool.query('UPDATE snkrs SET image_url = $1 WHERE id = $2', [imageUrl, id]);
            console.log(`Actualizada imagen para: ${query}`);
        } catch (error) {
            console.error(`Error al actualizar imagen para: ${query}`, error);
        }
    }

    pool.end(); // Cierra la conexión con la base de datos
    console.log('Proceso de actualización completado.');
};

updateSneakerImages();
