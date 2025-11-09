import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES = "7d";

// Registro de cliente
export const registroCliente = async (req, res) => {
  try {
    const { nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente, documento_cliente, nombre_usuario, contrasena } = req.body;
    if (!nombre_cliente || !apellido_cliente || !correo_cliente || !documento_cliente || !nombre_usuario || !contrasena) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }
    // Verificar unicidad
    const [existe] = await db.query("SELECT id_cliente FROM cliente WHERE correo_cliente = ? OR nombre_usuario = ? OR documento_cliente = ?", [correo_cliente, nombre_usuario, documento_cliente]);
    if (existe.length > 0) return res.status(409).json({ message: "Ya existe un cliente con ese correo, usuario o documento" });
    // Hash
    const hash = await bcrypt.hash(contrasena, 10);
    const [result] = await db.query(
      `INSERT INTO cliente (nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente, documento_cliente, nombre_usuario, contrasena, estado_cliente) VALUES (?, ?, ?, ?, ?, ?, ?, 'Activo')`,
      [nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente || '', documento_cliente, nombre_usuario, hash]
    );
    res.status(201).json({ message: "Cliente registrado", id_cliente: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error en registro", error: error.message });
  }
};

// Login de cliente
export const loginCliente = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;
    if (!usuario || !contrasena) return res.status(400).json({ message: "Usuario y contraseña requeridos" });
    const [rows] = await db.query(
      `SELECT * FROM cliente WHERE (correo_cliente = ? OR nombre_usuario = ?) AND estado_cliente = 'Activo'`,
      [usuario, usuario]
    );
    if (rows.length === 0) return res.status(401).json({ message: "Credenciales inválidas" });
    const cliente = rows[0];
    const ok = await bcrypt.compare(contrasena, cliente.contrasena || '');
    if (!ok) return res.status(401).json({ message: "Credenciales inválidas" });
    // JWT
    const token = jwt.sign({ id_cliente: cliente.id_cliente, nombre: cliente.nombre_cliente, rol: 'cliente' }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token, cliente: { id_cliente: cliente.id_cliente, nombre: cliente.nombre_cliente, apellido: cliente.apellido_cliente, correo: cliente.correo_cliente } });
  } catch (error) {
    res.status(500).json({ message: "Error en login", error: error.message });
  }
};

// Solicitar recuperación de contraseña
export const solicitarRecuperacion = async (req, res) => {
  try {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ message: "Correo requerido" });
    const [rows] = await db.query("SELECT * FROM cliente WHERE correo_cliente = ?", [correo]);
    if (rows.length === 0) return res.status(404).json({ message: "No existe cliente con ese correo" });
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min
    await db.query("UPDATE cliente SET reset_token = ?, reset_token_expires = ? WHERE id_cliente = ?", [token, expires, rows[0].id_cliente]);
    // Aquí deberías enviar el email con el link de recuperación
    // Por ahora solo lo devolvemos para pruebas
    res.json({ message: "Token generado", token });
  } catch (error) {
    res.status(500).json({ message: "Error solicitando recuperación", error: error.message });
  }
};

// Resetear contraseña
export const resetearContrasena = async (req, res) => {
  try {
    const { token, nueva } = req.body;
    if (!token || !nueva) return res.status(400).json({ message: "Token y nueva contraseña requeridos" });
    const [rows] = await db.query("SELECT * FROM cliente WHERE reset_token = ? AND reset_token_expires > NOW()", [token]);
    if (rows.length === 0) return res.status(400).json({ message: "Token inválido o expirado" });
    const hash = await bcrypt.hash(nueva, 10);
    await db.query("UPDATE cliente SET contrasena = ?, reset_token = NULL, reset_token_expires = NULL WHERE id_cliente = ?", [hash, rows[0].id_cliente]);
    res.json({ message: "Contraseña actualizada" });
  } catch (error) {
    res.status(500).json({ message: "Error al resetear contraseña", error: error.message });
  }
};
