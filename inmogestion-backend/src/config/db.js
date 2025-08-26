import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Probar conexión
try {
  await db.connect();
  console.log("✅ Conexión exitosa a la base de datos MySQL");
} catch (err) {
  console.error("❌ Error conectando a MySQL:", err.message);
}

export default db;
