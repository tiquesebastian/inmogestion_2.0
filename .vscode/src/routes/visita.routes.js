import { Router } from "express";
import { registrarVisita } from "../controllers/visita.controller.js";

const router = Router();

// Crear visita (agente crea/agenda una visita)
router.post("/", registrarVisita);

export default router;
