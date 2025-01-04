const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extraer el token del encabezado Authorization

    if (!token) {
        return res.status(401).json({ error: 'No autorizado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodificar el token usando la clave secreta
        req.user = { id: decoded.id }; // Agregar el ID del usuario al objeto `req`
        next(); // Continuar al siguiente middleware o controlador
    } catch (error) {
        return res.status(401).json({ error: 'No autorizado. Token inválido.' });
    }
};

module.exports = authMiddleware;
