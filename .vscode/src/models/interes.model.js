import db from "../config/db.js";

export const createInteres = async (data) => {
  const {
    id_propiedad,
    id_cliente,
    nombre_cliente,
    correo_cliente,
    telefono_cliente,
    mensaje,
    preferencias,
    estado,
    id_agente_asignado,
  } = data;

  const [result] = await db.query(
    `INSERT INTO interes_propiedad (id_propiedad, id_cliente, nombre_cliente, correo_cliente, telefono_cliente, mensaje, preferencias, estado, id_agente_asignado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id_propiedad,
      id_cliente || null,
      nombre_cliente || null,
      correo_cliente || null,
      telefono_cliente || null,
      mensaje || null,
      preferencias ? JSON.stringify(preferencias) : null,
      estado || 'Pendiente',
      id_agente_asignado || null,
    ]
  );

  return result.insertId;
};

export const getInteresesByPropiedad = async (id_propiedad) => {
  const [rows] = await db.query("SELECT * FROM interes_propiedad WHERE id_propiedad = ? ORDER BY fecha_registro DESC", [id_propiedad]);
  return rows;
};
