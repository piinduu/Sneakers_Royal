const bcrypt = require('bcrypt');
const pool = require('./db'); // Importa la conexión a la base de datos

const encryptPasswords = async () => {
    try {
        // Obtener todos los usuarios y sus contraseñas actuales
        const { rows: users } = await pool.query('SELECT id, password FROM usuarios');

        for (const user of users) {
            // Encriptar cada contraseña
            const hashedPassword = await bcrypt.hash(user.password, 10);

            // Actualizar la contraseña encriptada en la base de datos
            await pool.query('UPDATE usuarios SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
        }

        console.log('Contraseñas encriptadas correctamente.');
        pool.end(); // Cierra la conexión con la base de datos
    } catch (error) {
        console.error('Error al encriptar contraseñas:', error);
        pool.end();
    }
};

encryptPasswords();
