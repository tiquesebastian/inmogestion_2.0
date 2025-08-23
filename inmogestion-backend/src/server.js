import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba para verificar la BD
app.get("/api/test-db", async (req, res) => {
    try {
    const [rows] = await pool.query("SELECT 1 + 1 AS resultado");
    res.json({ success: true, resultado: rows[0].resultado });
    } catch (error) {
    res.status(500).json({ success: false, message: "Error en la base de datos", error });
    }
});

// Ruta principal
app.get("/", (req, res) => {
    res.send("Bienvenido a la API de InmoGestión 🚀");
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor InmoGestión corriendo en http://localhost:${PORT}`);
});
