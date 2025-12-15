import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { enviarEmailVerificacion } from "../services/email.service.js";
import { audit } from '../middleware/audit.middleware.js';

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

    // Insertar usuario (sin columnas de verificación para mantener compatibilidad si migración aún no aplicada)
    const [result] = await db.query(
      `INSERT INTO usuario (nombre, apellido, correo, telefono, nombre_usuario, contrasena, id_rol, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, telefono || null, nombre_usuario, hashedPassword, id_rol || 3, estado || "Activo"]
    );

    // Generar token verificación (64 hex) y expiración 24h
    const emailToken = crypto.randomBytes(32).toString("hex");
    const emailTokenHash = crypto.createHash('sha256').update(emailToken).digest('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Intentar actualizar columnas de verificación si existen
    try {
      await db.query(
        "UPDATE usuario SET email_token = ?, email_token_expires = ?, email_verificado = 0 WHERE id_usuario = ?",
        [emailTokenHash, expires, result.insertId]
      );
      // Enviar correo de verificación (con token original, no el hash)
      enviarEmailVerificacion({ email: correo, nombre: nombre, token: emailToken, tipoUsuario: 'usuario' })
        .catch(err => console.error('Error enviando email verificación usuario:', err));
    } catch (e) {
      console.warn("⚠ No se actualizaron columnas de verificación (¿Migración pendiente?)", e.message);
    }

    // Auditar registro exitoso
    await audit.register(correo, 'usuario', req).catch(err => 
      console.error('Error auditando registro:', err)
    );

    res.status(201).json({ message: "Usuario registrado. Revisa tu correo para verificar la cuenta.", usuarioId: result.insertId });
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
      // Auditar intento fallido
      await audit.login(correo, req, false).catch(err => 
        console.error('Error auditando login fallido:', err)
      );
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValida) {
      // Auditar contraseña incorrecta
      await audit.login(correo, req, false).catch(err => 
        console.error('Error auditando login fallido:', err)
      );
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Validar verificación de email si columna existe
    if (usuario.email_verificado !== undefined && usuario.email_verificado === 0) {
      return res.status(403).json({ message: "Correo no verificado. Revisa tu bandeja o solicita reenvío." });
    }

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        rol: usuario.id_rol,
      },
      process.env.JWT_SECRET || "secreto123",
      { expiresIn: "1h" }
    );

    // Auditar login exitoso
    await audit.login(correo, req, true).catch(err => 
      console.error('Error auditando login:', err)
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

// Verificar correo de usuario
export const verificarEmailUsuario = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ message: "Token requerido" });
    // Hashear el token recibido para comparar con el almacenado
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const [rows] = await db.query(
      "SELECT id_usuario, email_verificado FROM usuario WHERE email_token = ? AND email_token_expires > NOW()",
      [tokenHash]
    );
    if (rows.length === 0) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }
    const usuario = rows[0];
    if (usuario.email_verificado === 1) {
      return res.json({ message: "Correo ya verificado" });
    }
    await db.query(
      "UPDATE usuario SET email_verificado = 1, email_token = NULL, email_token_expires = NULL WHERE id_usuario = ?",
      [usuario.id_usuario]
    );
    res.json({ message: "Correo verificado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error verificando correo", error: error.message });
  }
};

// Reenviar correo de verificación para usuario
export const reenviarVerificacionUsuario = async (req, res) => {
  try {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ message: "Correo requerido" });
    
    const [rows] = await db.query(
      "SELECT id_usuario, nombre, email_verificado FROM usuario WHERE correo = ?",
      [correo]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    const usuario = rows[0];
    if (usuario.email_verificado === 1) {
      return res.status(400).json({ message: "El correo ya está verificado" });
    }
    
    // Generar nuevo token
    const emailToken = crypto.randomBytes(32).toString("hex");
    const emailTokenHash = crypto.createHash('sha256').update(emailToken).digest('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    await db.query(
      "UPDATE usuario SET email_token = ?, email_token_expires = ? WHERE id_usuario = ?",
      [emailTokenHash, expires, usuario.id_usuario]
    );
    
    // Enviar correo
    await enviarEmailVerificacion({
      email: correo,
      nombre: usuario.nombre,
      token: emailToken,
      tipoUsuario: 'usuario'
    });
    
    res.json({ message: "Correo de verificación reenviado. Revisa tu bandeja de entrada." });
  } catch (error) {
    console.error("Error reenviando verificación:", error);
    res.status(500).json({ message: "Error al reenviar verificación", error: error.message });
  }
};

// ===== Admin: Listar usuarios =====
export const listarUsuarios = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id_usuario, nombre, apellido, correo, telefono, nombre_usuario, id_rol, estado
       FROM usuario`
    );
    const mapped = rows.map(u => ({
      id_usuario: u.id_usuario,
      nombre: u.nombre,
      apellido: u.apellido,
      correo: u.correo,
      telefono: u.telefono,
      nombre_usuario: u.nombre_usuario,
      rol: u.id_rol === 1 ? 'Administrador' : u.id_rol === 2 ? 'Agente' : 'Cliente',
      estado: u.estado || 'Activo'
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: 'Error listando usuarios', error: error.message });
  }
};

// ===== Admin: Actualizar estado de usuario =====
export const actualizarEstadoUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    if (!estado || !['Activo','Inactivo','Bloqueado'].includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }
    const [result] = await db.query(
      'UPDATE usuario SET estado = ? WHERE id_usuario = ?',
      [estado, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Estado actualizado', id_usuario: Number(id), estado });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando estado', error: error.message });
  }
};
