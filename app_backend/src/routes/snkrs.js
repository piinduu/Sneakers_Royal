const express = require('express');
const router = express.Router();
const SnkrController = require('../controllers/snkrs');

// Ruta para obtener todas las zapatillas
router.get('/', SnkrController.getSnkrs);

// Ruta para crear una nueva zapatilla
router.post('/', SnkrController.createSnkr);

module.exports = router;
