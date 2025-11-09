import express from "express";
import {
  registroCliente,
  loginCliente,
  solicitarRecuperacion,
  resetearContrasena
} from "../controllers/authCliente.controller.js";

const router = express.Router();

// Registro de cliente
router.post("/registro-cliente", registroCliente);
// Login de cliente
router.post("/login-cliente", loginCliente);
// Solicitar recuperación
router.post("/recuperar", solicitarRecuperacion);
// Resetear contraseña
router.post("/resetear", resetearContrasena);

export default router;
