const pool = require('./db');

const initLowestPrices = async () => {
    try {
        // Iterar por las tallas estándar (35 a 50) e insertar precios iniciales para cada talla
        const sizes = Array.from({ length: 16 }, (_, i) => (35 + i).toString()); // Tallas del 35 al 50

        for (const size of sizes) {
            await pool.query(`
                INSERT INTO lowest_prices (snkr_id, size, price, user_id, created_at)
                SELECT 
                    s.id AS snkr_id, 
                    $1::varchar AS size, -- Convertir explícitamente a varchar
                    s.retail_price AS price, 
                    NULL AS user_id, -- NULL porque no hay usuario asignado inicialmente
                    NOW() AS created_at
                FROM snkrs s
                WHERE NOT EXISTS (
                    SELECT 1 FROM lowest_prices lp
                    WHERE lp.snkr_id = s.id AND lp.size = $1
                );
            `, [size]);
        }

        console.log(`Precios iniciales insertados en la tabla lowest_prices para todas las tallas.`);
        pool.end();
    } catch (error) {
        console.error('Error al inicializar la tabla lowest_prices:', error);
        pool.end();
    }
};

// Ejecutar la función
initLowestPrices();
