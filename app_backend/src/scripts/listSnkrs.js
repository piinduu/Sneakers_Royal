const pool = require('../config/db'); // Conexión a la base de datos

const listSnkrs = async () => {
    try {
        const result = await pool.query('SELECT * FROM snkrs');
        console.log(result.rows);
        process.exit(); // Finaliza el script
    } catch (err) {
        console.error("Error al listar los datos:", err);
        process.exit(1); // Salir con error
    }
};

listSnkrs();
