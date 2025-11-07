import { Router } from "express";
import {
  obtenerPropiedades,
  obtenerPropiedad,
  crearPropiedad,
  actualizarPropiedad,
  eliminarPropiedad,
  obtenerPropiedadesFiltradas,
} from "../controllers/propiedad.controller.js";
import { registrarInteres, listarInteresesPropiedad } from "../controllers/interes.controller.js";

const router = Router();

// Rutas principales de propiedades
router.get("/filter", obtenerPropiedadesFiltradas);
router.get("/", obtenerPropiedades);
router.get("/:id", obtenerPropiedad);
router.get("/:id/intereses", listarInteresesPropiedad);
router.post("/", crearPropiedad);
router.post("/:id/interest", registrarInteres);
router.put("/:id", actualizarPropiedad);
router.delete("/:id", eliminarPropiedad);

export default router;
