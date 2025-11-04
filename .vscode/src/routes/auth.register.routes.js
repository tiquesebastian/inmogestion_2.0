import { Router } from "express";
import { register } from "../controllers/usuario.controller.js";

const router = Router();

router.post("/register", register);  // Ruta pública para registro

export default router;
