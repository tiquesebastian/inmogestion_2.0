import { Router } from "express";
import { getHistorial, createHistorial } from "../controllers/historial.controller.js";

const router = Router();
router.get("/", getHistorial);
router.post("/", createHistorial);

export default router;
