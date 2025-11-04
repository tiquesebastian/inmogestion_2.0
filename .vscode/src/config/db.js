import mysql from "mysql2/promise";  // Importar cliente MySQL con soporte para promesas
import dotenv from "dotenv";          // Importar dotenv para cargar variables de entorno

dotenv.config();  // Cargar variables de entorno desde el archivo .env

// Crear una conexión a la base de datos usando datos del .env
const db = await mysql.createConnection({
  host: process.env.DB_HOST,       // Dirección del servidor de base de datos
  user: process.env.DB_USER,       // Usuario para la conexión
  password: process.env.DB_PASSWORD, // Contraseña para el usuario
  database: process.env.DB_NAME,     // Nombre de la base de datos a usar
  port: process.env.DB_PORT,         // Puerto donde escucha el servidor MySQL
});

// Intentar conectar a la base de datos para verificar que esté todo OK
try {
  await db.connect(); // Intentar conexión
  console.log("✅ Conexión exitosa a la base de datos MySQL"); // Mensaje de éxito
} catch (err) {
  // Capturar cualquier error y mostrarlo en consola
  console.error("❌ Error conectando a MySQL:", err.message);
}

export default db; // Exportar la conexión para usarla en otros módulos
