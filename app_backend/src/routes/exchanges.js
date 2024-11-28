const express = require('express');
const router = express.Router();
const  ExchangeController = require('../controllers/exchanges');

// Ruta para obtener todos los intercambios
router.get('/', ExchangeController.getExchanges);

// Ruta para crear un intercambio
router.post('/', ExchangeController.createExchange);

module.exports = router;
