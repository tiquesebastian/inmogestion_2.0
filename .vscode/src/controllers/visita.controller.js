import { createVisita, getVisitas, getVisitasByCliente, updateVisita, cancelarVisita } from "../models/visita.model.js";
import db from "../config/db.js";

export const registrarVisita = async (req, res) => {
  try {
    const { id_propiedad, id_cliente, id_agente, fecha_visita, hora_visita, notas } = req.body;

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

    const insertId = await createVisita({ id_propiedad, id_cliente, id_agente, fecha_visita, hora_visita, estado: 'Programada', notas });

    res.status(201).json({ ok: true, id_visita: insertId });
  } catch (error) {
    console.error("Error registrarVisita:", error);
    res.status(500).json({ message: "Error al registrar visita", error });
  }
};

export const listarVisitas = async (req, res) => {
  try {
    const { id_cliente } = req.query;
    if (id_cliente) {
      const rows = await getVisitasByCliente(id_cliente);
      return res.json(rows);
    }
    const rows = await getVisitas();
    res.json(rows);
  } catch (error) {
    console.error('Error listarVisitas:', error);
    res.status(500).json({ message: 'Error al listar visitas' });
  }
};

export const actualizarVisita = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_visita, hora_visita, notas, estado } = req.body || {};
    const ok = await updateVisita({ id_visita: id, fecha_visita, hora_visita, notas, estado });
    if (!ok) return res.status(404).json({ message: 'Visita no encontrada o sin cambios' });
    // devolver registro actualizado con alias
    const [rows] = await db.query('SELECT id_visita, id_propiedad, id_cliente, id_agente, fecha_visita, hora_visita, notas, estado AS estado_visita FROM visita WHERE id_visita = ?', [id]);
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Error actualizarVisita:', error);
    res.status(500).json({ message: 'Error al actualizar visita' });
  }
};

export const cancelarVisitaController = async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await cancelarVisita(id);
    if (!ok) return res.status(404).json({ message: 'Visita no encontrada' });
    const [rows] = await db.query('SELECT id_visita, id_propiedad, id_cliente, id_agente, fecha_visita, hora_visita, notas, estado AS estado_visita FROM visita WHERE id_visita = ?', [id]);
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Error cancelarVisita:', error);
    res.status(500).json({ message: 'Error al cancelar visita' });
  }
};
