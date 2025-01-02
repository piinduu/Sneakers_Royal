const SnkrModel = require('../models/snkrs');

// Obtener todas las zapatillas
const getSnkrs = async (req, res) => {
    try {
        const snkrs = await SnkrModel.getSnkrs();
        res.status(200).json(snkrs);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener zapatillas');
    }
};

// Crear una nueva zapatilla
const createSnkr = async (req, res) => {
    const { style_id, name, colorway, description, release_date, retail_price, image_url } = req.body;
    try {
        const newSnkr = await SnkrModel.createSnkr(
            style_id,
            name,
            colorway,
            description,
            release_date,
            retail_price,
            image_url
        );
        res.status(201).json(newSnkr);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear zapatilla');
    }
};

const searchSnkrs = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Debe proporcionar un término de búsqueda.' });
    }

    try {
        const results = await SnkrModel.searchByName(query); // Este método busca zapatillas por nombre
        res.status(200).json(results);
    } catch (error) {
        console.error('Error al buscar zapatillas:', error);
        res.status(500).json({ error: 'Error al buscar zapatillas' });
    }
};


// Obtener una zapatilla por su ID
const getSnkrById = async (req, res) => {
    const { id } = req.params; // Obtener el ID de los parámetros de la ruta
    try {
        const snkr = await SnkrModel.getSnkrById(id); // Llamar al modelo para obtener la zapatilla
        if (!snkr) {
            return res.status(404).json({ error: 'Zapatilla no encontrada' });
        }
        res.status(200).json(snkr);
    } catch (error) {
        console.error('Error al obtener zapatilla:', error);
        res.status(500).json({ error: 'Error al obtener zapatilla' });
    }
};

module.exports = {
    getSnkrs,
    createSnkr,
    searchSnkrs,
    getSnkrById,
};
