const PreciosUserModel = require('../models/users_price');

// Obtener precios por zapatilla
const getPreciosBySnkr = async (req, res) => {
    const { zapatilla_id } = req.params;
    try {
        const precios = await PreciosUserModel.getPreciosByZapatilla(zapatilla_id);
        res.status(200).json(precios);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener precios');
    }
};

// Crear un precio definido por un usuario
const createPrecio = async (req, res) => {
    const { zapatilla_id, user_id, size, price } = req.body;
    try {
        const nuevoPrecio = await PreciosUserModel.createPrecio(zapatilla_id, user_id, size, price);
        res.status(201).json(nuevoPrecio);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear precio');
    }
};

module.exports = {
    getPreciosBySnkr,
    createPrecio,
};
