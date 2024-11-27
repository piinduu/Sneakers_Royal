const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const usuariosRoutes = require('./routes/usuarios');
const snkrsRoutes = require('./routes/snkrs');
const preciosUserRoutes = require('./routes/users_price');
const intercambiosRoutes = require('./routes/exchanges');
const authRoutes = require('./routes/auth');

// Registrar rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/snkrs', snkrsRoutes);
app.use('/api/precios', preciosUserRoutes);
app.use('/api/intercambios', intercambiosRoutes);
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
