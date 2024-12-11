const ExchangeModel = require('../models/exchanges');

// Obtener todas las ofertas de intercambio activas
const getActiveExchanges = async (req, res) => {
    try {
        const exchanges = await ExchangeModel.getActiveExchanges();
        res.status(200).json(exchanges);
    } catch (error) {
        console.error('Error al obtener intercambios activos:', error);
        res.status(500).json({ error: 'Error al obtener intercambios' });
    }
};

// Obtener intercambios activos con paginación
const getExchangesWithPagination = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const exchanges = await ExchangeModel.getExchangesWithPagination(page, limit);
        res.status(200).json(exchanges);
    } catch (error) {
        console.error('Error al obtener intercambios paginados:', error);
        res.status(500).json({ error: 'Error al obtener intercambios' });
    }
};

// Crear una nueva oferta de intercambio
const createExchange = async (req, res) => {
    const { snkr_id, user_id, size, condition, status = 'pendiente', duration } = req.body;

    if (![7, 15, 30].includes(duration)) {
        return res.status(400).json({ error: 'Duración inválida. Solo se permite 7, 15 o 30 días.' });
    }

    try {
        const newExchange = await ExchangeModel.createExchange(snkr_id, user_id, size, condition, status, duration);
        res.status(201).json(newExchange);
    } catch (error) {
        console.error('Error al crear intercambio:', error);
        res.status(500).json({ error: 'Error al crear intercambio' });
    }
};

// Actualizar un intercambio existente
const updateExchange = async (req, res) => {
    const { id } = req.params;
    const { status, condition } = req.body;

    try {
        const updatedExchange = await ExchangeModel.updateExchange(id, status, condition);
        if (!updatedExchange) {
            return res.status(404).json({ error: 'Intercambio no encontrado' });
        }
        res.status(200).json(updatedExchange);
    } catch (error) {
        console.error('Error al actualizar intercambio:', error);
        res.status(500).json({ error: 'Error al actualizar intercambio' });
    }
};

// Eliminar un intercambio
const deleteExchange = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await ExchangeModel.deleteExchange(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Intercambio no encontrado' });
        }
        res.status(200).json({ message: 'Intercambio eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar intercambio:', error);
        res.status(500).json({ error: 'Error al eliminar intercambio' });
    }
};

module.exports = {
    getActiveExchanges,
    getExchangesWithPagination,
    createExchange,
    updateExchange,
    deleteExchange,
};
