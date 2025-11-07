import { createVisita } from "../models/visita.model.js";
import db from "../config/db.js";

export const registrarVisita = async (req, res) => {
  try {
    const { id_propiedad, id_cliente, id_agente, fecha_visita, notas } = req.body;

    if (!id_propiedad || !id_cliente || !id_agente || !fecha_visita) {
      return res.status(400).json({ message: "Faltan datos obligatorios para crear la visita" });
    }

    // Validar existencia de la propiedad y los usuarios
    const [p] = await db.query("SELECT id_propiedad FROM propiedad WHERE id_propiedad = ?", [id_propiedad]);
    if (p.length === 0) return res.status(404).json({ message: "Propiedad no encontrada" });

    const [c] = await db.query("SELECT id_cliente FROM cliente WHERE id_cliente = ?", [id_cliente]);
    if (c.length === 0) return res.status(404).json({ message: "Cliente no encontrado" });

    const [a] = await db.query("SELECT id_usuario FROM usuario WHERE id_usuario = ?", [id_agente]);
    if (a.length === 0) return res.status(404).json({ message: "Agente no encontrado" });

    const insertId = await createVisita({ id_propiedad, id_cliente, id_agente, fecha_visita, notas });

    res.status(201).json({ ok: true, id_visita: insertId });
  } catch (error) {
    console.error("Error registrarVisita:", error);
    res.status(500).json({ message: "Error al registrar visita", error });
  }
};
