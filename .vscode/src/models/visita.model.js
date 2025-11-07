import db from "../config/db.js";

export const createVisita = async (data) => {
  const { id_propiedad, id_cliente, id_agente, fecha_visita, estado, notas } = data;
  const [result] = await db.query(
    `INSERT INTO visita (id_propiedad, id_cliente, id_agente, fecha_visita, estado, notas) VALUES (?, ?, ?, ?, ?, ?)`,
    [id_propiedad, id_cliente, id_agente, fecha_visita, estado || 'Pendiente', notas || null]
  );
  return result.insertId;
};

export const getVisitasByAgente = async (id_agente) => {
  const [rows] = await db.query("SELECT * FROM visita WHERE id_agente = ? ORDER BY fecha_visita DESC", [id_agente]);
  return rows;
};
