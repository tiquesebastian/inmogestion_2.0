import express from "express";
import {
  getClientes,
  getClienteById, // 👈 Importar el nuevo controlador
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

// Obtener cliente por ID (✅ nuevo, al final)
router.get("/:id", getClienteById);

export default router;
