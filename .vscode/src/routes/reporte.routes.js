import express from "express";
import {
  getReportes,
  getClientesActivos,
  getReporteById,
  createReporte,
  getReportesByUsuario,
  getTotalVentas,
  getRendimientoAgentes,
  getPropiedadesDisponibles,
  getVentasRealizadas
} from "../controllers/reporte.controller.js";

const router = express.Router();


// Obtener todos los reportes
router.get("/", getReportes);

// Endpoint para obtener el reporte de propiedades disponibles
router.get("/propiedades-disponibles", getPropiedadesDisponibles);

// Endpoint para obtener el reporte de ventas realizadas
router.get("/ventas-realizadas", getVentasRealizadas);

// Endpoint para obtener los clientes más activos
router.get("/clientes-activos", getClientesActivos);

// Obtener un reporte por ID
router.get("/:id", getReporteById);

// Crear un nuevo reporte
router.post("/", createReporte);

// Obtener todos los reportes generados por un usuario
router.get("/usuario/:idUsuario", getReportesByUsuario);

// Obtener el total de ventas por rango de fechas
router.get("/ventas/total", getTotalVentas);

// Reporte especial: rendimiento de agentes
router.get("/rendimiento/agentes", getRendimientoAgentes);



export default router;
