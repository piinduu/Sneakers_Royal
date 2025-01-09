const express = require('express');
const router = express.Router();
const UserPricesController = require('../controllers/users_price');
const authMiddleware = require('../middleware/authMiddleware');

// Obtener precios mínimos por talla
router.get('/:snkr_id', authMiddleware, UserPricesController.getPricesBySnkr);

// Crear o actualizar un precio
router.post('/', authMiddleware, UserPricesController.createPrice);

module.exports = router;
