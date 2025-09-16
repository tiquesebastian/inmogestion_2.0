import db from "../config/db.js";      // Importar la configuración de la base de datos
import bcrypt from "bcryptjs";         // Librería para comparar contraseñas hash
import jwt from "jsonwebtoken";        // Librería para crear tokens JWT

export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;  // Extraer correo y contraseña del cuerpo de la solicitud

    // Buscar usuario en la base de datos por correo
    const [rows] = await db.query("SELECT * FROM usuario WHERE correo = ?", [correo]);

    // Si no se encuentra usuario, responder con error 404
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const usuario = rows[0];  // Obtener el usuario encontrado

    // Verificar que la contraseña ingresada coincida con la almacenada (hash)
    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValida) {
      // Si la contraseña es incorrecta, responder con error 401 (no autorizado)
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar un token JWT que contiene la información básica del usuario
    const token = jwt.sign(
      {
        id: usuario.id_usuario,   // ID del usuario
        rol: usuario.id_rol,      // Rol del usuario para permisos
      },
      process.env.JWT_SECRET || "secreto123",  // Clave secreta para firmar el token
      { expiresIn: "1h" }                       // El token expira en 1 hora
    );

    // Enviar respuesta con token y datos del usuario
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
    // Manejar errores inesperados y enviar respuesta con código 500
    res.status(500).json({ message: "Error en el login", error });
  }
};
