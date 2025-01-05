const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Encabezado Authorization:", authHeader); // Agrega este log
    if (!authHeader) {
        return res.status(401).json({ error: 'No autorizado. Token no proporcionado.' });
    }


    const token = authHeader.split(' ')[1]; // Extraer el token del encabezado Authorization
    if (!token) {
        return res.status(401).json({ error: 'No autorizado. Formato de token inválido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decodificado:", decoded);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        console.error("Error al verificar el token:", error.message);
        return res.status(401).json({ error: 'No autorizado. Token inválido o expirado.' });
    }
};

module.exports = authMiddleware;
