import express from "express";
import {
    obtenerClientes,
    agregarCliente,
    obtenerClientePorId,
    actualizarCliente,
    eliminarCliente,
} from "../controllers/cliente.controller.js";

const router = express.Router();

router.get("/", obtenerClientes);
router.post("/", agregarCliente);
router.get("/:id", obtenerClientePorId);
router.put("/:id", actualizarCliente);
router.delete("/:id", eliminarCliente);

export default router;
