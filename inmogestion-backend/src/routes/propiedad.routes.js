import { Router } from "express";
import {
  obtenerPropiedades,
  obtenerPropiedad,
  crearPropiedad,
  actualizarPropiedad,
  eliminarPropiedad,
} from "../controllers/propiedad.controller.js";

const router = Router();

// Rutas principales de propiedades
router.get("/", obtenerPropiedades);
router.get("/:id", obtenerPropiedad);
router.post("/", crearPropiedad);
router.put("/:id", actualizarPropiedad);
router.delete("/:id", eliminarPropiedad);

export default router;
