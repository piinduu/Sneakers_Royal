const express = require('express');
const router = express.Router();
const PreciosUserController = require('../controllers/users_price');

// Ruta para obtener precios de una zapatilla
router.get('/:zapatilla_id', PreciosUserController.getPreciosBySnkr);

// Ruta para crear un precio
router.post('/', PreciosUserController.createPrecio);

module.exports = router;
