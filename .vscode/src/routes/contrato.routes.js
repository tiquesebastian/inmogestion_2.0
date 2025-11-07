import express from "express";
import {
  getContratos,
  getContratoById,
  getContratosByCliente,
  getContratosByPropiedad,
  createContrato,
  updateContrato,
  deleteContrato,
  actualizarEstadoContrato
} from "../controllers/contrato.controller.js";

const router = express.Router();

// Listado y detalle
router.get("/", getContratos);

// Crear y actualizar completo
router.post("/", createContrato);
router.put("/:id", updateContrato);

// Actualizar solo estado
router.patch("/:id/estado", actualizarEstadoContrato);

// Eliminar
router.delete("/:id", deleteContrato);

// Filtros
router.get("/cliente/:id_cliente", getContratosByCliente);
router.get("/propiedad/:id_propiedad", getContratosByPropiedad);

// Detalle por ID (después de filtros para evitar conflictos de enrutado)
router.get("/:id", getContratoById);

export default router;
