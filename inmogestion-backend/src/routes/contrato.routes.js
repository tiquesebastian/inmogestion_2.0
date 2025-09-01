import { Router } from "express";
import {
  getContratos,
  getContratosByCliente,
  getContratosByPropiedad,
  createContrato,
  updateContrato,
  deleteContrato
} from "../controllers/contrato.controller.js";

const router = Router();

// Endpoints principales
router.get("/", getContratos);
router.get("/cliente/:id_cliente", getContratosByCliente);
router.get("/propiedad/:id_propiedad", getContratosByPropiedad);
router.post("/", createContrato);
router.put("/:id", updateContrato);
router.delete("/:id", deleteContrato);

export default router;
