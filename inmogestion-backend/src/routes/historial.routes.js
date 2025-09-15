import { Router } from "express";
import { getHistorial, createHistorial, deleteHistorial } from "../controllers/historial.controller.js";

const router = Router();

router.get("/", getHistorial);
router.post("/", createHistorial);
router.delete("/:id", deleteHistorial);

export default router;
