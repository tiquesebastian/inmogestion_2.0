import express from "express";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../controllers/cliente.controller.js";

const router = express.Router();

// Obtener todos los clientes
router.get("/", getClientes);

// Crear cliente
router.post("/", createCliente);

// Actualizar cliente
router.put("/:id", updateCliente);

// Eliminar cliente
router.delete("/:id", deleteCliente);

export default router;
