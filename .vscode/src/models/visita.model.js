import db from "../config/db.js";

export const createVisita = async (data) => {
  const { id_propiedad, id_cliente, id_agente, fecha_visita, hora_visita, estado, notas } = data;
  const [result] = await db.query(
    `INSERT INTO visita (id_propiedad, id_cliente, id_agente, fecha_visita, hora_visita, estado, notas) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id_propiedad, id_cliente, id_agente, fecha_visita, hora_visita || null, estado || 'Programada', notas || null]
  );
  return result.insertId;
};

// Obtener todas las visitas (ordenadas por fecha descendente)
export const getVisitas = async () => {
  const [rows] = await db.query("SELECT id_visita, id_propiedad, id_cliente, id_agente, fecha_visita, hora_visita, notas, estado AS estado_visita FROM visita ORDER BY fecha_visita DESC");
  return rows;
};

// Obtener visitas por cliente
export const getVisitasByCliente = async (id_cliente) => {
  const [rows] = await db.query("SELECT id_visita, id_propiedad, id_cliente, id_agente, fecha_visita, hora_visita, notas, estado AS estado_visita FROM visita WHERE id_cliente = ? ORDER BY fecha_visita DESC", [id_cliente]);
  return rows;
};

// Actualizar visita (fecha, notas, estado)
export const updateVisita = async ({ id_visita, fecha_visita, hora_visita, notas, estado }) => {
  const fields = [];
  const params = [];
  if (fecha_visita !== undefined) { fields.push('fecha_visita = ?'); params.push(fecha_visita); }
  if (hora_visita !== undefined) { fields.push('hora_visita = ?'); params.push(hora_visita); }
  if (notas !== undefined) { fields.push('notas = ?'); params.push(notas); }
  if (estado !== undefined) { fields.push('estado = ?'); params.push(estado); }
  if (!fields.length) return null;
  params.push(id_visita);
  const [result] = await db.query(`UPDATE visita SET ${fields.join(', ')} WHERE id_visita = ?`, params);
  return result.affectedRows > 0;
};

// Cancelar visita
export const cancelarVisita = async (id_visita) => {
  const [result] = await db.query("UPDATE visita SET estado = 'Cancelada' WHERE id_visita = ?", [id_visita]);
  return result.affectedRows > 0;
};
