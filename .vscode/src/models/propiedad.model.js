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
