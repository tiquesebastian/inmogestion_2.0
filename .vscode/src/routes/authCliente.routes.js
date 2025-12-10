import express from "express";
import {
  registroCliente,
  loginCliente,
  solicitarRecuperacion,
  resetearContrasena,
  verificarEmailCliente,
  reenviarVerificacionCliente
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
router.get("/verificar-email-cliente/:token", verificarEmailCliente);
router.post("/reenviar-verificacion-cliente", reenviarVerificacionCliente);

export default router;
