import bcrypt from "bcrypt"; // Librería para encriptar y comparar contraseñas
import jwt from "jsonwebtoken"; // Librería para generar tokens JWT
import { getUsuarioPorCorreo } from "../models/usuario.model.js"; // Función para obtener usuario por correo

export const login = async (req, res) => {
  const { correo, contrasena } = req.body; // Extraemos correo y contraseña del cuerpo de la petición

  try {
    // Buscamos el usuario en la base de datos por correo y que esté activo
    const usuario = await getUsuarioPorCorreo(correo);

    // Si no existe usuario, respondemos con error 404 (no encontrado)
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparamos la contraseña enviada con la almacenada en la base de datos (hash)
    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

    // Si la contraseña es incorrecta, respondemos con error 401 (no autorizado)
    if (!passwordValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generamos un token JWT con información relevante del usuario
    const token = jwt.sign(
      {
        id: usuario.id_usuario,   // ID del usuario
        rol: usuario.id_rol,      // Rol del usuario (para permisos)
        nombre: usuario.nombre,   // Nombre del usuario
      },
      process.env.JWT_SECRET || "secreto123", // Clave secreta para firmar el token
      { expiresIn: "2h" } // El token expira en 2 horas
    );

    // Respondemos con el token y algunos datos del usuario
    res.json({
      message: "Login exitoso",
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.id_rol,
      },
    });
  } catch (err) {
    // Si hay algún error inesperado, respondemos con error 500 (error en servidor)
    res.status(500).json({ message: "Error en el servidor", error: err.message });
  }
};
