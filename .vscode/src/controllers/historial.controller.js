import db from "../config/db.js";

// Obtener historial completo
export const getHistorial = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM historial_estado_propiedad");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener historial", error });
  }
};

// Crear registro en historial
export const createHistorial = async (req, res) => {
  try {
    const { estado_anterior, estado_nuevo, justificacion, id_propiedad, id_usuario } = req.body;

    if (!estado_anterior || !estado_nuevo || !id_propiedad || !id_usuario) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(
      `INSERT INTO historial_estado_propiedad 
       (estado_anterior, estado_nuevo, justificacion, id_propiedad, id_usuario) 
       VALUES (?, ?, ?, ?, ?)`,
      [estado_anterior, estado_nuevo, justificacion || null, id_propiedad, id_usuario]
    );

    res.status(201).json({
      message: "Historial registrado exitosamente",
      historialId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear historial", error });
  }
};

// Eliminar historial
export const deleteHistorial = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM historial_estado_propiedad WHERE id_historial = ?", [id]);
    res.json({ message: "Historial eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar historial", error });
  }
};
