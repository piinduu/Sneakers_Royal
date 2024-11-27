const express = require('express');
const router = express.Router();
const IntercambiosController = require('../controllers/exchanges');

// Ruta para obtener todos los intercambios
router.get('/', IntercambiosController.getIntercambios);

// Ruta para crear un intercambio
router.post('/', IntercambiosController.createIntercambio);

module.exports = router;
