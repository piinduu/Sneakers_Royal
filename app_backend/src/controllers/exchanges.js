const ExchangeModel = require('../models/exchanges');

// Obtener todas las ofertas de intercambio
const getExchanges = async (req, res) => {
    try {
        const exchanges = await ExchangeModel.getExchanges();
        res.status(200).json(exchanges);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener intercambios');
    }
};

// Crear una oferta de intercambio
const createExchange = async (req, res) => {
    const { snkr_id, user_id, size, status } = req.body;
    try {
        const newExchange = await ExchangeModel.createExchange(snkr_id, user_id, size, status);
        res.status(201).json(newExchange);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear intercambio');
    }
};

module.exports = {
    getExchanges,
    createExchange,
};
