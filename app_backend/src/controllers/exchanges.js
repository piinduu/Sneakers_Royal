const ExchangeModel = require('../models/exchanges');
const pool = require('../config/db');

// Obtener todas las ofertas de intercambio activas para el usuario autenticado
const getActiveExchanges = async (req, res) => {
    try {
        const userId = req.user.id; // ID del usuario autenticado
        const exchanges = await ExchangeModel.getActiveExchanges(userId);
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
    const { id } = req.params; // ID recibido de los parámetros
    const { status } = req.body; // Estado recibido del cuerpo de la solicitud

    if (!status) {
        return res.status(400).json({ error: "El campo 'status' es obligatorio." });
    }

    // Validar que el ID sea un entero
    const exchangeId = parseInt(id, 10);
    if (isNaN(exchangeId)) {
        return res.status(400).json({ error: "El ID proporcionado no es válido." });
    }

    try {
        const updatedExchange = await ExchangeModel.updateExchange(exchangeId, status);

        if (!updatedExchange) {
            return res.status(404).json({ error: "Intercambio no encontrado." });
        }

        res.status(200).json({
            message: "Intercambio actualizado con éxito.",
            exchange: updatedExchange,
        });
    } catch (error) {
        console.error("Error al actualizar intercambio:", error);
        res.status(500).json({ error: "Error al actualizar intercambio." });
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

const getAllActiveExchanges = async (req, res) => {
    try {
        const exchanges = await pool.query(`
            SELECT 
                e.id,
                e.size,
                e.condition,
                e.status,
                e.duration,
                e.created_at,
                s.name AS sneaker_name,
                s.image_url AS image_url,
                u.username AS owner
            FROM exchanges e
            JOIN snkrs s ON e.snkr_id = s.id
            JOIN users u ON e.user_id = u.id
            WHERE e.status = 'pendiente'
            ORDER BY e.created_at DESC
        `);

        console.log("Datos obtenidos del backend:", exchanges.rows); // Inspecciona la respuesta del backend

        const formattedExchanges = exchanges.rows.map((row) => ({
            ...row,
            time_left: Math.max(
                0,
                Math.ceil(
                    (new Date(row.created_at).getTime() +
                        row.duration * 24 * 60 * 60 * 1000 -
                        Date.now()) /
                    (1000 * 60 * 60 * 24)
                )
            ),
        }));

        res.status(200).json(formattedExchanges);
    } catch (error) {
        console.error("Error al obtener todos los intercambios activos:", error);
        res.status(500).json({ error: "Error al obtener intercambios activos" });
    }
};

const getExchangeById = async (req, res) => {
    try {
        const { id } = req.params;

        // Log para verificar el ID recibido
        console.log("ID recibido:", id);

        if (isNaN(parseInt(id, 10))) {
            console.error("ID inválido:", id);
            return res.status(400).json({ error: "ID inválido, debe ser un número" });
        }

        const query = `
            SELECT 
                e.id AS exchange_id,
                e.size AS offered_size,
                e.condition AS offered_condition,
                e.status,
                e.duration,
                e.created_at,
                s.name AS sneaker_name,
                s.image_url AS image_url,
                s.description AS sneaker_description,
                u.username AS owner,
                ARRAY(
                    SELECT json_build_object(
                        'snkr_id', r.snkr_id,
                        'size', r.size,
                        'condition', r.condition,
                        'name', sn.name,
                        'image_url', sn.image_url
                    )
                    FROM exchange_requests r
                    LEFT JOIN snkrs sn ON r.snkr_id = sn.id
                    WHERE r.exchange_id = e.id
                ) AS requested_sneakers
            FROM exchanges e
            JOIN snkrs s ON e.snkr_id = s.id
            JOIN users u ON e.user_id = u.id
            WHERE e.id = $1
        `;

        // Log para verificar la consulta
        console.log("Ejecutando consulta para ID:", id);

        const result = await pool.query(query, [id]);

        // Log para verificar el resultado de la consulta
        console.log("Resultado de la consulta:", result.rows);

        if (result.rows.length === 0) {
            console.error("No se encontró intercambio con ID:", id);
            return res.status(404).json({ error: "Intercambio no encontrado" });
        }

        const exchange = result.rows[0];

        // Log para verificar los datos procesados
        console.log("Datos procesados antes de enviar:", exchange);

        res.status(200).json(exchange);
    } catch (error) {
        console.error("Error al obtener detalles del intercambio:", error);
        res.status(500).json({ error: "Error al obtener los detalles del intercambio" });
    }
};


module.exports = {
    getActiveExchanges,
    getExchangesWithPagination,
    createExchange,
    updateExchange,
    updateAcceptedSneakers,
    deleteExchange,
    getAllActiveExchanges,
    getExchangeById,
};
