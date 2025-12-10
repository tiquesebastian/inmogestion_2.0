import express from "express";
import { register, login, solicitarRecuperacionUsuario, resetearContrasenaUsuario, verificarEmailUsuario, reenviarVerificacionUsuario } from "../controllers/usuario.controller.js";
import { loginLimiter, authGenericLimiter } from '../middleware/rateLimit.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = express.Router();

router.post("/register",
	authGenericLimiter,
	validate([
		{ field: 'nombre', required: true, minLength: 2 },
		{ field: 'apellido', required: true, minLength: 2 },
		{ field: 'correo', required: true, type: 'email' },
		{ field: 'nombre_usuario', required: true, minLength: 3 },
		{ field: 'contrasena', required: true, minLength: 6 }
	]),
	register
);

router.post("/login",
	loginLimiter,
	validate([
		{ field: 'correo', required: true, type: 'email' },
		{ field: 'contrasena', required: true, minLength: 6 }
	]),
	login
);

router.post("/recuperar-usuario",
	authGenericLimiter,
	validate([{ field: 'correo', required: true, type: 'email' }]),
	solicitarRecuperacionUsuario
);

router.post("/resetear-usuario",
	authGenericLimiter,
	validate([
		{ field: 'token', required: true, minLength: 10 },
		{ field: 'nueva', required: true, minLength: 6 }
	]),
	resetearContrasenaUsuario
);
router.get("/verificar-email-usuario/:token", verificarEmailUsuario);
router.post("/reenviar-verificacion-usuario", reenviarVerificacionUsuario);

export default router;
