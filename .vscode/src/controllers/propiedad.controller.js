/**
 * Controlador de propiedades
 * Obtener propiedades filtradas por tipo, localidad y precio.
 */

import db from "../config/db.js";
import {
  getAllPropiedades,
  getPropiedadById,
  createPropiedad,
  updatePropiedad,
  deletePropiedad,
} from "../models/propiedad.model.js";
/**
 * Obtener propiedades filtradas por tipo, localidad y precio.
 */
export const obtenerPropiedadesFiltradas = async (req, res) => {
  try {
    const { tipo, localidad, precioMin, precioMax, habitaciones, banos, estado } = req.query;
    let query = `SELECT p.*, b.nombre_barrio, l.nombre_localidad, u.nombre AS agente FROM propiedad p
      JOIN barrio b ON p.id_barrio = b.id_barrio
      JOIN localidad l ON b.id_localidad = l.id_localidad
      JOIN usuario u ON p.id_usuario = u.id_usuario
      WHERE 1=1`;
    const params = [];
    if (tipo) {
      query += " AND p.tipo_propiedad = ?";
      params.push(tipo);
    }
    if (localidad) {
      // Comparación insensible a mayúsculas y tildes
      query += " AND LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(l.nombre_localidad,'á','a'),'é','e'),'í','i'),'ó','o'),'ú','u')) LIKE ?";
      const localidadNormalizada = localidad
        .toLowerCase()
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u');
      params.push(`%${localidadNormalizada}%`);
    }
    if (precioMin) {
      query += " AND p.precio_propiedad >= ?";
      params.push(Number(precioMin));
    }
    if (precioMax) {
      query += " AND p.precio_propiedad <= ?";
      params.push(Number(precioMax));
    }
    if (habitaciones) {
      query += " AND p.num_habitaciones >= ?";
      params.push(Number(habitaciones));
    }
    if (banos) {
      query += " AND p.num_banos >= ?";
      params.push(Number(banos));
    }
    // Filtrar por estado solo si se proporciona, de lo contrario mostrar todas
    if (estado) {
      query += " AND p.estado_propiedad = ?";
      params.push(estado);
    }
    query += " ORDER BY p.fecha_registro DESC";
    const [rows] = await db.query(query, params);
    
    // Obtener imágenes para las propiedades filtradas (si la tabla existe)
    let imagenesPorPropiedad = {};
    if (rows.length > 0) {
      try {
        const propIds = rows.map(r => r.id_propiedad);
        const [imagenes] = await db.query(`
          SELECT id_propiedad, id_imagen, url, prioridad, descripcion 
          FROM imagen_propiedad 
          WHERE id_propiedad IN (?)
          ORDER BY id_propiedad, prioridad DESC
        `, [propIds]);
        
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
      
      // Agregar imágenes a cada propiedad
      const propiedadesConImagenes = rows.map(prop => ({
        ...prop,
        imagenes: imagenesPorPropiedad[prop.id_propiedad] || []
      }));
      
      res.json(propiedadesConImagenes);
    } else {
      res.json(rows);
    }
  } catch (error) {
    console.error("Error en obtenerPropiedadesFiltradas:", error);
    res.status(500).json({ message: "Error al filtrar propiedades", error: error.message });
  }
};

/**
 * Obtener todas las propiedades registradas.
 */
export const obtenerPropiedades = async (req, res) => {
  try {
    const propiedades = await getAllPropiedades();
    res.json(propiedades);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener propiedades", error });
  }
};

/**
 * Obtener una propiedad específica por ID.
 */
export const obtenerPropiedad = async (req, res) => {
  try {
    const propiedad = await getPropiedadById(req.params.id);

    if (!propiedad) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    res.json(propiedad);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la propiedad", error });
  }
};

/**
 * Crear una nueva propiedad con validaciones robustas.
 */
export const crearPropiedad = async (req, res) => {
  try {
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
      id_usuario,
    } = req.body;

    // 🔍 Validar campos obligatorios
    if (!tipo_propiedad || !direccion_formato || !precio_propiedad || !id_barrio || !id_usuario) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // 🔢 Validar que el precio sea positivo
    if (precio_propiedad <= 0) {
      return res.status(400).json({ message: "El precio debe ser mayor a 0" });
    }

    // 🏘️ Validar que el barrio exista
    const [barrio] = await db.query("SELECT * FROM barrio WHERE id_barrio = ?", [id_barrio]);
    if (barrio.length === 0) {
      return res.status(404).json({ message: "El barrio no existe" });
    }

    // 👤 Validar que el usuario exista
    const [usuario] = await db.query("SELECT * FROM usuario WHERE id_usuario = ?", [id_usuario]);
    if (usuario.length === 0) {
      return res.status(404).json({ message: "El usuario no existe" });
    }

    // 🛠️ Crear propiedad si todo está OK
    const insertId = await createPropiedad({
      tipo_propiedad,
      direccion_formato,
      precio_propiedad,
      area_m2,
      num_habitaciones,
      num_banos,
      descripcion,
      estado_propiedad,
      id_barrio,
      id_usuario,
    });

    res.status(201).json({ 
      message: "Propiedad creada exitosamente", 
      propiedadId: insertId,
      id_propiedad: insertId 
    });
  } catch (error) {
    console.error("❌ Error al crear propiedad:", error);
    res.status(500).json({ message: "Error al crear propiedad", error: error.message });
  }
};

/**
 * Actualizar una propiedad.
 */
export const actualizarPropiedad = async (req, res) => {
  try {
    const id = req.params.id;
    // Obtener estado actual para registrar historial si cambia
    const [actualRows] = await db.query("SELECT estado_propiedad FROM propiedad WHERE id_propiedad = ?", [id]);
    const actual = actualRows && actualRows[0];

    const result = await updatePropiedad(id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    // Si se envía estado_propiedad y cambió, registrar en historial
    if (req.body.estado_propiedad && actual && actual.estado_propiedad !== req.body.estado_propiedad) {
      const estado_anterior = actual.estado_propiedad;
      const estado_nuevo = req.body.estado_propiedad;
      const justificacion = req.body.justificacion || null;
      const id_usuario = req.body.id_usuario; // quien ejecuta el cambio
      if (id_usuario) {
        try {
          await db.query(
            `INSERT INTO historial_estado_propiedad (estado_anterior, estado_nuevo, justificacion, id_propiedad, id_usuario)
             VALUES (?, ?, ?, ?, ?)`,
            [estado_anterior, estado_nuevo, justificacion, id, id_usuario]
          );
        } catch (e) {
          console.warn('No se pudo registrar historial de estado:', e.message);
        }
      }
    }

    res.json({ message: "Propiedad actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar propiedad", error });
  }
};

/**
 * Eliminar una propiedad.
 */
export const eliminarPropiedad = async (req, res) => {
  try {
    const result = await deletePropiedad(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
    }

    res.json({ message: "Propiedad eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar propiedad", error });
  }
};

