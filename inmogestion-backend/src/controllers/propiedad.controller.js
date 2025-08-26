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
 * Crear una nueva propiedad.
 */
export const crearPropiedad = async (req, res) => {
  try {
    const propiedadId = await createPropiedad(req.body);
    res.status(201).json({ message: "Propiedad creada exitosamente", propiedadId });
  } catch (error) {
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
