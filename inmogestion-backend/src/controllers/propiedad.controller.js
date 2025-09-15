import {
  getAllPropiedades,
  getPropiedadById,
  createPropiedad,
  updatePropiedad,
  deletePropiedad,
} from "../models/propiedad.model.js";

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
      descripcion,
      estado_propiedad,
      id_barrio,
      id_usuario
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
    const [result] = await db.query(
      "INSERT INTO propiedad (tipo_propiedad, direccion_formato, precio_propiedad, area_m2, descripcion, estado_propiedad, id_barrio, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [tipo_propiedad, direccion_formato, precio_propiedad, area_m2, descripcion, estado_propiedad, id_barrio, id_usuario]
    );

    res.status(201).json({
      message: "Propiedad creada exitosamente",
      propiedadId: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error al crear propiedad:", error);
    res.status(500).json({ message: "Error al crear propiedad", error });
  }
};

/**
 * Actualizar una propiedad.
 */
export const actualizarPropiedad = async (req, res) => {
  try {
    const result = await updatePropiedad(req.params.id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Propiedad no encontrada" });
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
