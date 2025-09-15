import jwt from "jsonwebtoken";

// Verifica que el usuario tenga token válido
export const verificarToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto123");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// Verifica que el usuario tenga rol específico
export const verificarRol = (rolRequerido) => {
  return (req, res, next) => {
    if (req.user.rol !== rolRequerido) {
      return res.status(403).json({ message: "No tienes permisos para esta acción" });
    }
    next();
  };
};
