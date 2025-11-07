import db from "../config/db.js"; // Conexión a la base de datos
import {
  insertContrato,
  getAllContratos,
  getContrato as getContratoModel,
  getContratosPorPropiedad,
  getContratosPorCliente,
  updateEstadoContrato,
  deleteContratoById
} from "../models/contrato.model.js";

//  Obtener todos los contratos con información relacionada (cliente, propiedad, usuario)
export const getContratos = async (_req, res) => {
  try {
    const rows = await getAllContratos();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener contratos", error: error.message });
  }
};

//  Obtener un contrato específico por su ID
export const getContratoById = async (req, res) => {
  try {
    const contrato = await getContratoModel(req.params.id);
    if (!contrato) return res.status(404).json({ message: "Contrato no encontrado" });
    res.json(contrato);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener contrato", error: error.message });
  }
};

// Crear contrato con validaciones
export const createContrato = async (req, res) => {
  try {
    const { fecha_contrato, valor_venta, fecha_venta, archivo_pdf, id_propiedad, id_cliente, id_usuario, estado_contrato } = req.body;
    if (!fecha_contrato || !valor_venta || !id_propiedad || !id_cliente || !id_usuario) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }
    if (valor_venta <= 0) return res.status(400).json({ message: "El valor de venta debe ser mayor a 0" });
    // Validar existencia entidades
    const [prop] = await db.query("SELECT id_propiedad FROM propiedad WHERE id_propiedad = ?", [id_propiedad]);
    if (prop.length === 0) return res.status(404).json({ message: "Propiedad inexistente" });
    const [cli] = await db.query("SELECT id_cliente FROM cliente WHERE id_cliente = ?", [id_cliente]);
    if (cli.length === 0) return res.status(404).json({ message: "Cliente inexistente" });
    const [usr] = await db.query("SELECT id_usuario FROM usuario WHERE id_usuario = ?", [id_usuario]);
    if (usr.length === 0) return res.status(404).json({ message: "Usuario inexistente" });
    const id = await insertContrato({ fecha_contrato, valor_venta, fecha_venta, archivo_pdf, id_propiedad, id_cliente, id_usuario, estado_contrato });
    res.status(201).json({ message: "Contrato creado", contratoId: id });
  } catch (error) {
    res.status(500).json({ message: "Error al crear contrato", error: error.message });
  }
};

//  Actualizar un contrato existente
export const updateContrato = async (req, res) => {
  try {
    const { id } = req.params;
    const c = await getContratoModel(id);
    if (!c) return res.status(404).json({ message: "Contrato no encontrado" });
    const { fecha_contrato, valor_venta, fecha_venta, archivo_pdf, id_propiedad, id_cliente, id_usuario, estado_contrato } = req.body;
    await db.query(
      `UPDATE contrato SET fecha_contrato=?, valor_venta=?, fecha_venta=?, archivo_pdf=?, id_propiedad=?, id_cliente=?, id_usuario=?, estado_contrato=? WHERE id_contrato=?`,
      [fecha_contrato, valor_venta, fecha_venta || null, archivo_pdf || null, id_propiedad, id_cliente, id_usuario, estado_contrato, id]
    );
    res.json({ message: "Contrato actualizado" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar contrato", error: error.message });
  }
};

//  Eliminar un contrato por su ID
export const deleteContrato = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteContratoById(id);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Contrato no encontrado" });
    res.json({ message: "Contrato eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar contrato", error: error.message });
  }
};

//  Obtener todos los contratos de un cliente específico
export const getContratosByCliente = async (req, res) => {
  try {
    const rows = await getContratosPorCliente(req.params.id_cliente);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener contratos por cliente", error: error.message });
  }
};

//  Obtener todos los contratos de una propiedad específica
export const getContratosByPropiedad = async (req, res) => {
  try {
    const rows = await getContratosPorPropiedad(req.params.id_propiedad);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener contratos por propiedad", error: error.message });
  }
};

export const actualizarEstadoContrato = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_contrato } = req.body;
    if (!estado_contrato) return res.status(400).json({ message: "estado_contrato requerido" });
    const result = await updateEstadoContrato(id, estado_contrato);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Contrato no encontrado" });
    res.json({ message: "Estado de contrato actualizado" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar estado", error: error.message });
  }
};
