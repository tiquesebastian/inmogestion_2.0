import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { enviarEmailVerificacion } from "../services/email.service.js";
import { audit } from '../middleware/audit.middleware.js';

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

    // Token verificación
    const emailToken = crypto.randomBytes(32).toString("hex");
    const emailTokenHash = crypto.createHash('sha256').update(emailToken).digest('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    try {
      await db.query(
        "UPDATE cliente SET email_token = ?, email_token_expires = ?, email_verificado = 0 WHERE id_cliente = ?",
        [emailTokenHash, expires, result.insertId]
      );
      // Enviar correo de verificación (con token original, no el hash)
      enviarEmailVerificacion({ email: correo_cliente, nombre: nombre_cliente, token: emailToken, tipoUsuario: 'cliente' })
        .catch(err => console.error('Error enviando email verificación cliente:', err));
    } catch (e) {
      console.warn("⚠ No se actualizaron columnas verificación cliente (¿Migración pendiente?)", e.message);
    }

    // Auditar registro exitoso
    await audit.register(correo_cliente, 'cliente', req).catch(err => 
      console.error('Error auditando registro cliente:', err)
    );

    res.status(201).json({ message: "Cliente registrado. Revisa tu correo para verificar la cuenta.", id_cliente: result.insertId });
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
    if (rows.length === 0) {
      // Auditar login fallido
      await audit.login(usuario, req, false).catch(err => 
        console.error('Error auditando login fallido cliente:', err)
      );
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    const cliente = rows[0];
    const ok = await bcrypt.compare(contrasena, cliente.contrasena || '');
    if (!ok) {
      // Auditar password incorrecta
      await audit.login(cliente.correo_cliente, req, false).catch(err => 
        console.error('Error auditando login fallido cliente:', err)
      );
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    if (cliente.email_verificado !== undefined && cliente.email_verificado === 0) {
      return res.status(403).json({ message: "Correo no verificado. Revisa tu bandeja o solicita reenvío." });
    }
    // JWT
    const token = jwt.sign({ id_cliente: cliente.id_cliente, nombre: cliente.nombre_cliente, rol: 'cliente' }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    
    // Auditar login exitoso
    await audit.login(cliente.correo_cliente, req, true).catch(err => 
      console.error('Error auditando login cliente:', err)
    );
    
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

export const verificarEmailCliente = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ message: "Token requerido" });
    const [rows] = await db.query(
      "SELECT id_cliente, email_verificado FROM cliente WHERE email_token = ? AND email_token_expires > NOW()",
      [token]
    );
    if (rows.length === 0) return res.status(400).json({ message: "Token inválido o expirado" });
    const cliente = rows[0];
    if (cliente.email_verificado === 1) return res.json({ message: "Correo ya verificado" });
    await db.query(
      "UPDATE cliente SET email_verificado = 1, email_token = NULL, email_token_expires = NULL WHERE id_cliente = ?",
      [cliente.id_cliente]
    );
    res.json({ message: "Correo verificado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error verificando correo", error: error.message });
  }
};

export const reenviarVerificacionCliente = async (req, res) => {
  try {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ message: "Correo requerido" });
    
    const [rows] = await db.query(
      "SELECT id_cliente, nombre_cliente, email_verificado FROM cliente WHERE correo_cliente = ?",
      [correo]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    
    const cliente = rows[0];
    if (cliente.email_verificado === 1) {
      return res.status(400).json({ message: "El correo ya está verificado" });
    }
    
    const emailToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    await db.query(
      "UPDATE cliente SET email_token = ?, email_token_expires = ? WHERE id_cliente = ?",
      [emailToken, expires, cliente.id_cliente]
    );
    
    await enviarEmailVerificacion({
      email: correo,
      nombre: cliente.nombre_cliente,
      token: emailToken,
      tipoUsuario: 'cliente'
    });
    
    res.json({ message: "Correo de verificación reenviado. Revisa tu bandeja de entrada." });
  } catch (error) {
    console.error("Error reenviando verificación cliente:", error);
    res.status(500).json({ message: "Error al reenviar verificación", error: error.message });
  }
};
