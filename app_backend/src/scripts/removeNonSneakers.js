const pool = require('../config/db'); // Asegúrate de que la configuración de la base de datos es correcta

const deleteNonSneakers = async () => {
    try {
        // Consulta para eliminar registros que no sean zapatillas
        const deleteQuery = `
      DELETE FROM snkrs
      WHERE LOWER(name) LIKE '%hoodie%'
         OR LOWER(name) LIKE '%sweatpants%'
         OR LOWER(name) LIKE '%jacket%'
         OR LOWER(name) LIKE '%sunglasses%'
         OR LOWER(name) LIKE '%card holder%'
         OR LOWER(name) LIKE '%toque%'
         OR LOWER(name) LIKE '%tee%'
         OR LOWER(name) LIKE '%backpack%'
         OR LOWER(name) LIKE '%bag%'
         OR LOWER(name) LIKE '%slipper%'
         OR LOWER(name) LIKE '%beanie%'
         OR LOWER(name) LIKE '%puffer%'
         OR LOWER(name) LIKE '%essentials%'
         OR LOWER(name) LIKE '%hyperwarm%'
         OR LOWER(name) LIKE '%tazz%'
         OR LOWER(name) LIKE '%tasman%'
         OR LOWER(name) LIKE '%shopping bag%'
         OR LOWER(name) LIKE '%arch logo%'
         OR LOWER(name) LIKE '%passport%'
         OR LOWER(name) LIKE '%panda card%'
         OR LOWER(name) LIKE '%elasticized%'
         OR LOWER(name) LIKE '%spezial%'
         OR LOWER(name) LIKE '%therma-fit%'
         OR LOWER(name) LIKE '%joggers%';
    `;

        // Ejecutar la consulta
        const result = await pool.query(deleteQuery);

        // Confirmar cuántos registros fueron eliminados
        console.log(`Se eliminaron ${result.rowCount} registros no relacionados con zapatillas.`);

        // Verificar los registros restantes
        const remainingSneakers = await pool.query('SELECT * FROM snkrs');
        console.log(`Registros restantes en la tabla snkrs:`, remainingSneakers.rows);

        console.log('Operación completada exitosamente.');
    } catch (error) {
        console.error('Error al eliminar registros no deseados:', error);
    } finally {
        pool.end(); // Cierra la conexión a la base de datos
    }
};

// Ejecutar la función
deleteNonSneakers();
