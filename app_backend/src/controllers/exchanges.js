const IntercambioModel = require('../models/exchanges');

// Obtener todas las ofertas de intercambio
const getIntercambios = async (req, res) => {
    try {
        const intercambios = await IntercambioModel.getIntercambios();
        res.status(200).json(intercambios);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener intercambios');
    }
};

// Crear una oferta de intercambio
const createIntercambio = async (req, res) => {
    const { zapatilla_id, user_id, size, status } = req.body;
    try {
        const nuevoIntercambio = await IntercambioModel.createIntercambio(zapatilla_id, user_id, size, status);
        res.status(201).json(nuevoIntercambio);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear intercambio');
    }
};

module.exports = {
    getIntercambios,
    createIntercambio,
};
