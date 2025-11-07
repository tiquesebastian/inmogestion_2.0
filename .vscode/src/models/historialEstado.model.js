import db from "../config/db.js";

export const insertarHistorialEstado = async ({ estado_anterior, estado_nuevo, justificacion = null, id_propiedad, id_usuario }) => {
  const [result] = await db.query(
    `INSERT INTO historial_estado_propiedad (estado_anterior, estado_nuevo, justificacion, id_propiedad, id_usuario)
     VALUES (?, ?, ?, ?, ?)`,
    [estado_anterior, estado_nuevo, justificacion, id_propiedad, id_usuario]
  );
  return result.insertId;
};

export const obtenerHistorialPorPropiedad = async (id_propiedad) => {
  const [rows] = await db.query(
    `SELECT h.*, u.nombre AS usuario_nombre
     FROM historial_estado_propiedad h
     JOIN usuario u ON h.id_usuario = u.id_usuario
     WHERE h.id_propiedad = ?
     ORDER BY h.fecha_cambio DESC`,
    [id_propiedad]
  );
  return rows;
};
