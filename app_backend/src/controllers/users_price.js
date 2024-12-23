const UserPricesModel = require('../models/users_price');
const SnkrModel = require('../models/snkrs'); // Para validar snkrs
const usersModel = require('../models/users'); // Para validar users

// Obtener precios mínimos por talla para una snkr
const getPricesBySnkr = async (req, res) => {
    const { snkr_id } = req.params;

    try {
        // Verificar que la snkr existe
        const snkr = await SnkrModel.getSnkrById(snkr_id);
        if (!snkr) {
            return res.status(404).json({ error: 'snkr no encontrada' });
        }

        // Obtener precios mínimos por talla
        const prices = await UserPricesModel.getMinPricesBySnkr(snkr_id);

        res.status(200).json(prices);
    } catch (error) {
        console.error('Error al obtener precios:', error);
        res.status(500).json({ error: 'Error al obtener precios' });
    }
};

// Crear o actualizar un precio definido por un user
const createPrice = async (req, res) => {
    const { snkr_id, user_id, size, price } = req.body;

    try {
        // Validar que la snkr existe
        const snkr = await SnkrModel.getSnkrById(snkr_id);
        if (!snkr) {
            return res.status(404).json({ error: 'snkr no encontrada' });
        }

        // Validar que el user existe
        const user = await usersModel.findUserById(user_id);
        if (!user) {
            return res.status(404).json({ error: 'user no encontrado' });
        }

        // Validar si el precio actual es menor o igual
        const existingPrice = await UserPricesModel.getPriceBySnkrAndUser(snkr_id, user_id, size);
        if (existingPrice && price > existingPrice.price) {
            return res.status(400).json({
                error: 'El nuevo precio no puede ser mayor al precio actual',
            });
        }

        // Crear o actualizar el precio
        const newPrice = await UserPricesModel.createOrUpdatePrice(snkr_id, user_id, size, price);

        res.status(201).json(newPrice);
    } catch (error) {
        console.error('Error al crear o actualizar precio:', error);
        res.status(500).json({ error: 'Error al crear o actualizar precio' });
    }
};

module.exports = {
    getPricesBySnkr,
    createPrice,
};
