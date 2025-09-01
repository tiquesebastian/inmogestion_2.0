import { Router } from "express";
import { getInteracciones, createInteraccion } from "../controllers/interaccion.controller.js";

const router = Router();
router.get("/", getInteracciones);
router.post("/", createInteraccion);

export default router;
