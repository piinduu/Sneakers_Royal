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
    const { snkr_id, size, condition, duration, acceptedSneakers } = req.body;

    // Validar los datos principales
    if (!snkr_id || !size || !condition || !duration) {
        console.error("Error de validación: Datos incompletos o incorrectos.");
        return res.status(400).json({ error: "Datos incompletos o incorrectos." });
    }

    try {
        const user_id = req.user.id; // ID del usuario autenticado
        console.log("ID del usuario autenticado:", user_id);

        const newExchange = await ExchangeModel.createExchange(
            snkr_id,
            user_id,
            size,
            condition,
            duration,
            acceptedSneakers || []
        );

        res.status(201).json(newExchange);
    } catch (error) {
        console.error("Error al crear intercambio:", error);
        res.status(500).json({ error: "Error al crear intercambio." });
    }
};

// Actualizar detalles generales del intercambio
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

// Actualizar zapatillas aceptadas en un intercambio existente
const updateAcceptedSneakers = async (req, res) => {
    const { id } = req.params; // ID del intercambio
    const { acceptedSneakers } = req.body; // Zapatillas aceptadas

    // Validar los datos
    if (!Array.isArray(acceptedSneakers) || acceptedSneakers.length === 0) {
        return res.status(400).json({ error: 'Datos incompletos o incorrectos.' });
    }

    try {
        console.log(`Actualizando zapatillas aceptadas para el intercambio ID: ${id}`);
        const updatedSneakers = await ExchangeModel.updateExchangeAcceptedSneakers(id, acceptedSneakers);

        if (!updatedSneakers) {
            return res.status(404).json({ error: 'Intercambio no encontrado' });
        }

        res.status(200).json({ message: 'Zapatillas aceptadas actualizadas con éxito', updatedSneakers });
    } catch (error) {
        console.error('Error al actualizar zapatillas aceptadas:', error);
        res.status(500).json({ error: 'Error al actualizar zapatillas aceptadas' });
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
    updateAcceptedSneakers,
    deleteExchange,
};
