import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Solo cargar .env si estamos en desarrollo local
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Debug: Mostrar variables de entorno
console.log("🔍 Variables de BD cargadas:");
console.log("  DB_HOST:", process.env.DB_HOST);
console.log("  DB_PORT:", process.env.DB_PORT);
console.log("  DB_USER:", process.env.DB_USER);
console.log("  DB_NAME:", process.env.DB_NAME);
console.log("  NODE_ENV:", process.env.NODE_ENV);

const resolvedHost = process.env.DB_HOST || 'mysql-j05y.railway.internal';

// Crear pool de conexiones (mejor práctica y maneja errores mejor)
const pool = mysql.createPool({
  host: resolvedHost,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar conexión sin bloquear el inicio del servidor
pool.getConnection()
  .then(conn => {
    console.log("✅ Conexión exitosa a la base de datos MySQL");
    conn.release();
  })
  .catch(err => {
    console.error("❌ Error conectando a MySQL:", err.message);
  });

export default pool;
