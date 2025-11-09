import express from "express";
import {
  generarContrato,
  getContrato,
  getContratosPorCliente,
  getTodosLosContratos,
  descargarContrato
} from "../controllers/contratoDocumento.controller.js";

const router = express.Router();

// Generar nuevo contrato
router.post("/generar", generarContrato);

// Obtener todos los contratos (admin/agente)
router.get("/", getTodosLosContratos);

// Obtener contratos de un cliente específico
router.get("/cliente/:id_cliente", getContratosPorCliente);

// Descargar PDF de un contrato
router.get("/descargar/:id", descargarContrato);

// Obtener un contrato por ID
router.get("/:id", getContrato);

export default router;
