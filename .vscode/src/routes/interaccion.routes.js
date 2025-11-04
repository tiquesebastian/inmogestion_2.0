import { Router } from "express";
import { getInteracciones, createInteraccion, deleteInteraccion } from "../controllers/interaccion.controller.js";

const router = Router();

router.get("/", getInteracciones);
router.post("/", createInteraccion);
router.delete("/:id", deleteInteraccion);

export default router;
