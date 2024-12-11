const express = require('express');
const app = express();
const cronJobs = require('./config/cronJobs'); 

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const usersRoutes = require('./routes/usuarios');
const snkrsRoutes = require('./routes/snkrs');
const userPricesRoutes = require('./routes/users_price');
const exchangeRoutes = require('./routes/exchanges');
const authRoutes = require('./routes/auth');

// Registrar rutas
app.use('/api/users', usersRoutes);
app.use('/api/snkrs', snkrsRoutes);
app.use('/api/prices', userPricesRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
