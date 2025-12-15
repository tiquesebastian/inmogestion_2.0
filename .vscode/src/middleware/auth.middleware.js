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
  const rolesPermitidos = Array.isArray(rolRequerido) ? rolRequerido : [rolRequerido];
  return (req, res, next) => {
    const userRol = req.user?.rol;
    // Soporta números o etiquetas en la BD ("Administrador", "Agente", etc.)
    const normalizar = (r) =>
      typeof r === 'string'
        ? r.toLowerCase()
        : Number.isFinite(r)
          ? String(r)
          : '';

    const userRolNorm = normalizar(userRol);
    const allow = rolesPermitidos.some((r) => {
      const rolNorm = normalizar(r);
      // Aceptar equivalencias comunes de admin
      if (rolNorm === '1' || rolNorm === 'administrador' || rolNorm === 'admin') {
        return ['1', 'administrador', 'admin'].includes(userRolNorm);
      }
      return rolNorm === userRolNorm;
    });

    if (!allow) {
      return res.status(403).json({ message: "No tienes permiso para esta acción" });
    }
    next();
  };
};
