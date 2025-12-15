import db from "../config/db.js";

/**
 * Obtener todas las propiedades de la base de datos.
 * Retorna una lista con todos los registros incluyendo información de localidad, barrio e imágenes.
 */
export const getAllPropiedades = async () => {
  const [rows] = await db.query(`
    SELECT 
      p.*,
      p.area_m2 as area_construida_propiedad,
      p.num_habitaciones as habitaciones_propiedad,
      p.num_banos as banos_propiedad,
      b.nombre_barrio,
      l.nombre_localidad,
      u.nombre as nombre_agente,
      u.apellido as apellido_agente
    FROM propiedad p
    LEFT JOIN barrio b ON p.id_barrio = b.id_barrio
    LEFT JOIN localidad l ON b.id_localidad = l.id_localidad
    LEFT JOIN usuario u ON p.id_usuario = u.id_usuario
    ORDER BY p.fecha_registro DESC
  `);
  
  // Intentar obtener imágenes (puede fallar si la tabla no existe)
  let imagenesPorPropiedad = {};
  try {
    const [imagenes] = await db.query(`
      SELECT id_propiedad, id_imagen, url, prioridad, descripcion 
      FROM imagen_propiedad 
      ORDER BY id_propiedad, prioridad DESC
    `);
    
    // Agrupar imágenes por propiedad
    imagenes.forEach(img => {
      if (!imagenesPorPropiedad[img.id_propiedad]) {
        imagenesPorPropiedad[img.id_propiedad] = [];
      }
      imagenesPorPropiedad[img.id_propiedad].push({
        id_imagen: img.id_imagen,
        url_imagen: img.url,
        prioridad: img.prioridad,
        descripcion: img.descripcion
      });
    });
  } catch (error) {
    console.warn('⚠️  Tabla imagen_propiedad no disponible:', error.message);
  }
  
  // Agregar array de imágenes a cada propiedad
  return rows.map(prop => ({
    ...prop,
    imagenes: imagenesPorPropiedad[prop.id_propiedad] || []
  }));
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

  // Construir query dinámicamente solo con campos definidos
  const updates = [];
  const values = [];

  if (tipo_propiedad !== undefined) { updates.push('tipo_propiedad=?'); values.push(tipo_propiedad); }
  if (direccion_formato !== undefined) { updates.push('direccion_formato=?'); values.push(direccion_formato); }
  if (precio_propiedad !== undefined) { updates.push('precio_propiedad=?'); values.push(precio_propiedad); }
  if (area_m2 !== undefined) { updates.push('area_m2=?'); values.push(area_m2); }
  if (num_habitaciones !== undefined) { updates.push('num_habitaciones=?'); values.push(num_habitaciones); }
  if (num_banos !== undefined) { updates.push('num_banos=?'); values.push(num_banos); }
  if (descripcion !== undefined) { updates.push('descripcion=?'); values.push(descripcion); }
  if (estado_propiedad !== undefined) { updates.push('estado_propiedad=?'); values.push(estado_propiedad); }
  if (id_barrio !== undefined && id_barrio !== '') { updates.push('id_barrio=?'); values.push(id_barrio); }
  if (id_usuario !== undefined) { updates.push('id_usuario=?'); values.push(id_usuario); }

  if (updates.length === 0) {
    return { affectedRows: 0 }; // No hay campos para actualizar
  }

  values.push(id_propiedad); // Agregar el ID al final para WHERE

  const [result] = await db.query(
    `UPDATE propiedad SET ${updates.join(', ')} WHERE id_propiedad=?`,
    values
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
