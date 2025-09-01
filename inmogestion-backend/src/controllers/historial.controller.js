import db from "../config/db.js";

// Obtener historial
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

    const [result] = await db.query(
      "INSERT INTO historial_estado_propiedad (estado_anterior, estado_nuevo, justificacion, id_propiedad, id_usuario) VALUES (?, ?, ?, ?, ?)",
      [estado_anterior, estado_nuevo, justificacion, id_propiedad, id_usuario]
    );

    res.status(201).json({ message: "Historial agregado correctamente", historialId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error al crear historial", error });
  }
};
