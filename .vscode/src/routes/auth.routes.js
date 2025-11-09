import express from "express";
import { register, login, solicitarRecuperacionUsuario, resetearContrasenaUsuario } from "../controllers/usuario.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/recuperar-usuario", solicitarRecuperacionUsuario);
router.post("/resetear-usuario", resetearContrasenaUsuario);

export default router;
