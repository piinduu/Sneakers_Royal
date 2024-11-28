const express = require('express');
const router = express.Router();
const UserPricesController = require('../controllers/users_price');

// Ruta para obtener precios de una zapatilla
router.get('/:snkr_id', UserPricesController.getPricesBySnkr);

// Ruta para crear o actualizar un precio
router.post('/', UserPricesController.createPrice);

module.exports = router;
