const cron = require('node-cron');
const ExchangeModel = require('../models/exchanges');

// Función para limpiar intercambios expirados
const cleanExpiredExchanges = async () => {
    try {
        console.log('Iniciando limpieza de intercambios expirados...');
        const result = await ExchangeModel.deleteExpiredExchanges();
        console.log(`Se eliminaron ${result.rowCount} intercambios expirados.`);
    } catch (error) {
        console.error('Error al limpiar intercambios expirados:', error);
    }
};

// Programar la tarea para que se ejecute diariamente a la medianoche
cron.schedule('0 0 * * *', cleanExpiredExchanges);

console.log('Cron job de limpieza de intercambios programado.');
