const express = require('express');
const cors = require('cors'); // Importar CORS
const app = express();
const cronJobs = require('./config/cronJobs');

// Middleware para parsear JSON
app.use(express.json());

// Configurar CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: (origin, callback) => {
        // Permitir solicitudes desde cualquier "localhost"
        if (!origin || origin.startsWith('http://localhost')) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    credentials: true // Si necesitas enviar cookies o autenticación
}));

// Importar rutas
const usersRoutes = require('./routes/users');
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
