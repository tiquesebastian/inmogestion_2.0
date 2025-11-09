import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const register = async (req, res) => {
  console.log("📥 Datos recibidos en registro:", req.body);

  try {
    const { nombre, apellido, correo, telefono, nombre_usuario, contrasena, id_rol, estado } = req.body;

    // Validar campos obligatorios
    if (!nombre || !apellido || !correo || !nombre_usuario || !contrasena) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Verificar que no exista el correo
    const [correoExist] = await db.query("SELECT 1 FROM usuario WHERE correo = ?", [correo]);
    if (correoExist.length > 0) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    // Verificar que no exista el nombre_usuario
    const [usuarioExist] = await db.query("SELECT 1 FROM usuario WHERE nombre_usuario = ?", [nombre_usuario]);
    if (usuarioExist.length > 0) {
      return res.status(409).json({ message: "El nombre de usuario ya está en uso" });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    // Insertar usuario
    const [result] = await db.query(
      `INSERT INTO usuario (nombre, apellido, correo, telefono, nombre_usuario, contrasena, id_rol, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, telefono || null, nombre_usuario, hashedPassword, id_rol || 3, estado || "Activo"]
    );

    res.status(201).json({ message: "Usuario registrado exitosamente", usuarioId: result.insertId });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error al registrar usuario", error });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const [rows] = await db.query("SELECT * FROM usuario WHERE correo = ?", [correo]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        rol: usuario.id_rol,
      },
      process.env.JWT_SECRET || "secreto123",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.id_rol,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el login", error });
  }
};

// Solicitar recuperación de contraseña para usuarios (agente/admin)
export const solicitarRecuperacionUsuario = async (req, res) => {
  try {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ message: "Correo requerido" });
    
    const [rows] = await db.query("SELECT * FROM usuario WHERE correo = ?", [correo]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No existe usuario con ese correo" });
    }
    
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min
    
    await db.query(
      "UPDATE usuario SET reset_token = ?, reset_token_expires = ? WHERE id_usuario = ?",
      [token, expires, rows[0].id_usuario]
    );
    
    // Aquí deberías enviar el email con el link de recuperación
    // Por ahora solo lo devolvemos para pruebas
    res.json({ message: "Token generado", token });
  } catch (error) {
    res.status(500).json({ message: "Error solicitando recuperación", error: error.message });
  }
};

// Resetear contraseña para usuarios (agente/admin)
export const resetearContrasenaUsuario = async (req, res) => {
  try {
    const { token, nueva } = req.body;
    if (!token || !nueva) {
      return res.status(400).json({ message: "Token y nueva contraseña requeridos" });
    }
    
    const [rows] = await db.query(
      "SELECT * FROM usuario WHERE reset_token = ? AND reset_token_expires > NOW()",
      [token]
    );
    
    if (rows.length === 0) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(nueva, salt);
    
    await db.query(
      "UPDATE usuario SET contrasena = ?, reset_token = NULL, reset_token_expires = NULL WHERE id_usuario = ?",
      [hash, rows[0].id_usuario]
    );
    
    res.json({ message: "Contraseña actualizada" });
  } catch (error) {
    res.status(500).json({ message: "Error al resetear contraseña", error: error.message });
  }
};
