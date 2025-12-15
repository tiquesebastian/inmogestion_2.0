import express from "express";
import { login, register, verificarEmailUsuario, reenviarVerificacionUsuario, listarUsuarios, actualizarEstadoUsuario } from "../controllers/usuario.controller.js";

const router = express.Router();

// Auth
router.post("/auth/login", login);

// Admin: gestión de usuarios
router.get("/", listarUsuarios);
router.patch("/:id/estado", actualizarEstadoUsuario);

export default router;
