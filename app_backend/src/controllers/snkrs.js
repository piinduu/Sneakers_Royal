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

module.exports = {
    getSnkrs,
    createSnkr,
};
