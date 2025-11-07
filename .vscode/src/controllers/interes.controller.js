import { createInteres, getInteresesByPropiedad } from "../models/interes.model.js";
import db from "../config/db.js";

export const registrarInteres = async (req, res) => {
  try {
    const id_propiedad = parseInt(req.params.id, 10);
    if (isNaN(id_propiedad)) return res.status(400).json({ message: "ID de propiedad inválido" });

    const { id_cliente, nombre_cliente, correo_cliente, telefono_cliente, mensaje, preferencias } = req.body;

    // Verificar que la propiedad exista
    const [propRows] = await db.query("SELECT id_propiedad FROM propiedad WHERE id_propiedad = ?", [id_propiedad]);
    if (propRows.length === 0) return res.status(404).json({ message: "Propiedad no encontrada" });

    // Insertar interés
    const insertId = await createInteres({
      id_propiedad,
      id_cliente,
      nombre_cliente,
      correo_cliente,
      telefono_cliente,
      mensaje,
      preferencias,
    });

    // Responder
    res.status(201).json({ ok: true, id_interes: insertId });
  } catch (error) {
    console.error("Error registrarInteres:", error);
    res.status(500).json({ message: "Error al registrar interés", error });
  }
};

export const listarInteresesPropiedad = async (req, res) => {
  try {
    const id_propiedad = parseInt(req.params.id, 10);
    if (isNaN(id_propiedad)) return res.status(400).json({ message: "ID de propiedad inválido" });

    const rows = await getInteresesByPropiedad(id_propiedad);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener intereses", error });
  }
};
