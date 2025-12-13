import mysql from "mysql2/promise";  
import dotenv from "dotenv";          

dotenv.config();  

// Crear pool de conexiones (mejor práctica y maneja errores mejor)
const pool = mysql.createPool({
  host: process.env.DB_HOST,       
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
