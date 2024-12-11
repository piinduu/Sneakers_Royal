const express = require('express');
const router = express.Router();
const ExchangeController = require('../controllers/exchanges');

// Ruta para obtener todos los intercambios activos (máximo 30 días)
router.get('/', ExchangeController.getActiveExchanges);

// Ruta para obtener intercambios activos con paginación
router.get('/paginated', ExchangeController.getExchangesWithPagination);

// Ruta para crear un nuevo intercambio
router.post('/', ExchangeController.createExchange);

// Ruta para actualizar un intercambio
router.put('/:id', ExchangeController.updateExchange);

// Ruta para eliminar un intercambio
router.delete('/:id', ExchangeController.deleteExchange);

module.exports = router;
