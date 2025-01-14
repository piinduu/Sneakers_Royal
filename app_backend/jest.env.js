const dotenv = require('dotenv');
const result = dotenv.config({ path: '.env.test' });

if (result.error) {
    console.error("Error al cargar .env.test:", result.error);
} else {
    console.log("Variables de entorno para test cargadas:", result.parsed);
}
