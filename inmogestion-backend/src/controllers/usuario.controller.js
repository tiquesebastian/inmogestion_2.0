import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
