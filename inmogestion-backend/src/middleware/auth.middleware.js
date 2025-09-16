// Importamos la librería jsonwebtoken para manejar tokens JWT
import jwt from "jsonwebtoken";

// ✅ Middleware para verificar el token y validar roles permitidos (opcional)
export const verificarToken = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Token requerido" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto123");
      req.user = decoded;

      if (
        rolesPermitidos.length > 0 &&
        !rolesPermitidos.includes(decoded.rol)
      ) {
        return res.status(403).json({ message: "No tienes permiso" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  };
};

// ✅ Middleware adicional para validar un rol específico (opcional)
export const verificarRol = (rolRequerido) => {
  return (req, res, next) => {
    if (req.user?.rol !== rolRequerido) {
      return res.status(403).json({ message: "No tienes permiso para esta acción" });
    }
    next();
  };
};
