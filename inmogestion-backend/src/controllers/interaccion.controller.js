import db from "../config/db.js";

// Obtener interacciones
export const getInteracciones = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM interaccion_cliente");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener interacciones", error });
  }
};

// Crear interacción
export const createInteraccion = async (req, res) => {
  try {
    const { id_cliente, id_usuario, tipo_interaccion, notas } = req.body;

    const [result] = await db.query(
      "INSERT INTO interaccion_cliente (id_cliente, id_usuario, tipo_interaccion, notas) VALUES (?, ?, ?, ?)",
      [id_cliente, id_usuario, tipo_interaccion, notas]
    );

    res.status(201).json({ message: "Interacción registrada correctamente", interaccionId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error al crear interacción", error });
  }
};
