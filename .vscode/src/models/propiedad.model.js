import db from "../config/db.js";

/**
 * Obtener todas las propiedades de la base de datos.
 * Retorna una lista con todos los registros.
 */
export const getAllPropiedades = async () => {
  const [rows] = await db.query("SELECT * FROM propiedad");
  return rows;
};

/**
 * Obtener una propiedad específica por su ID.
 * @param {number} id_propiedad - ID único de la propiedad.
 */
export const getPropiedadById = async (id_propiedad) => {
  const [rows] = await db.query("SELECT * FROM propiedad WHERE id_propiedad = ?", [id_propiedad]);
  return rows[0];
};

/**
 * Crear una nueva propiedad.
 * @param {object} data - Información de la propiedad.
 */
export const createPropiedad = async (data) => {
  const {
    tipo_propiedad,
    direccion_formato,
    precio_propiedad,
    area_m2,
    num_habitaciones,
    num_banos,
    descripcion,
    estado_propiedad,
    id_barrio,
    id_usuario
  } = data;

  const [result] = await db.query(
    `INSERT INTO propiedad 
      (tipo_propiedad, direccion_formato, precio_propiedad, area_m2, num_habitaciones, num_banos, descripcion, estado_propiedad, id_barrio, id_usuario)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [tipo_propiedad, direccion_formato, precio_propiedad, area_m2, num_habitaciones, num_banos, descripcion, estado_propiedad, id_barrio, id_usuario]
  );

  return result.insertId;
};

/**
 * Actualizar una propiedad existente.
 * @param {number} id_propiedad - ID de la propiedad a actualizar.
 * @param {object} data - Campos que se van a modificar.
 */
export const updatePropiedad = async (id_propiedad, data) => {
  const {
    tipo_propiedad,
    direccion_formato,
    precio_propiedad,
    area_m2,
    num_habitaciones,
    num_banos,
    descripcion,
    estado_propiedad,
    id_barrio,
    id_usuario
  } = data;

  const [result] = await db.query(
    `UPDATE propiedad 
     SET tipo_propiedad=?, direccion_formato=?, precio_propiedad=?, area_m2=?, num_habitaciones=?, num_banos=?, descripcion=?, estado_propiedad=?, id_barrio=?, id_usuario=?
     WHERE id_propiedad=?`,
    [tipo_propiedad, direccion_formato, precio_propiedad, area_m2, num_habitaciones, num_banos, descripcion, estado_propiedad, id_barrio, id_usuario, id_propiedad]
  );

  return result;
};

/**
 * Eliminar una propiedad por ID.
 * @param {number} id_propiedad - ID de la propiedad a eliminar.
 */
export const deletePropiedad = async (id_propiedad) => {
  const [result] = await db.query("DELETE FROM propiedad WHERE id_propiedad = ?", [id_propiedad]);
  return result;
};
