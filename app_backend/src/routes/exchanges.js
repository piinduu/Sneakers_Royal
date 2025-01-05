const express = require('express');
const router = express.Router();
const ExchangeController = require('../controllers/exchanges');
const authMiddleware = require('../middleware/authMiddleware'); // Importar el middleware de autenticación

// Ruta para obtener todos los intercambios activos (máximo 30 días)
router.get('/', authMiddleware, ExchangeController.getActiveExchanges);

// Ruta para obtener intercambios activos con paginación
router.get('/paginated', authMiddleware, ExchangeController.getExchangesWithPagination);

// Ruta para crear un nuevo intercambio
router.post('/', authMiddleware, ExchangeController.createExchange);

// Ruta para actualizar un intercambio
router.put('/:id', authMiddleware, ExchangeController.updateExchange);

// Ruta para actualizar zapatillas aceptadas en un intercambio
router.put('/:id/accepted-sneakers', authMiddleware, ExchangeController.updateAcceptedSneakers);

// Ruta para eliminar un intercambio
router.delete('/:id', authMiddleware, ExchangeController.deleteExchange);

module.exports = router;
