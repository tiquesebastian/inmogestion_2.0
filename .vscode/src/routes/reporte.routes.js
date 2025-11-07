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
  getVentasRealizadas,
  // Nuevos endpoints
  getDashboard,
  getResumenVentasController,
  getVentasPorAgenteController,
  getVentasPorLocalidadController,
  getPropiedadesPorEstadoController,
  getTopPropiedadesInteresesController,
  getFunnelController,
  getClientesNuevosController,
  getTiempoCicloController,
  getPropiedadesSinActividadController
} from "../controllers/reporte.controller.js";

const router = express.Router();

// ========== DASHBOARD PRINCIPAL ==========
// GET /api/reportes/dashboard?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD
router.get("/dashboard", getDashboard);

// ========== REPORTES DE VENTAS ==========
// GET /api/reportes/ventas/resumen?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD
router.get("/ventas/resumen", getResumenVentasController);

// GET /api/reportes/ventas/agentes?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD
router.get("/ventas/agentes", getVentasPorAgenteController);

// GET /api/reportes/ventas/localidades?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD
router.get("/ventas/localidades", getVentasPorLocalidadController);

// GET /api/reportes/ventas/tiempo-ciclo?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD
router.get("/ventas/tiempo-ciclo", getTiempoCicloController);

// Endpoint legacy (mantener compatibilidad)
router.get("/ventas/total", getTotalVentas);

// ========== REPORTES DE PROPIEDADES ==========
// GET /api/reportes/propiedades/estado
router.get("/propiedades/estado", getPropiedadesPorEstadoController);

// GET /api/reportes/propiedades/top-intereses?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD&limit=10
router.get("/propiedades/top-intereses", getTopPropiedadesInteresesController);

// GET /api/reportes/propiedades/sin-actividad?dias=30
router.get("/propiedades/sin-actividad", getPropiedadesSinActividadController);

// Endpoint legacy
router.get("/propiedades-disponibles", getPropiedadesDisponibles);

// ========== REPORTES DE CLIENTES ==========
// GET /api/reportes/clientes/nuevos?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD
router.get("/clientes/nuevos", getClientesNuevosController);

// Endpoint legacy
router.get("/clientes-activos", getClientesActivos);

// ========== FUNNEL DE CONVERSIÓN ==========
// GET /api/reportes/funnel?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD
router.get("/funnel", getFunnelController);

// ========== ENDPOINTS LEGACY (mantener compatibilidad) ==========
// Obtener todos los reportes
router.get("/", getReportes);

// Reporte especial: rendimiento de agentes
router.get("/rendimiento/agentes", getRendimientoAgentes);

// Endpoint para obtener el reporte de ventas realizadas
router.get("/ventas-realizadas", getVentasRealizadas);

// Obtener un reporte por ID
router.get("/:id", getReporteById);

// Crear un nuevo reporte
router.post("/", createReporte);

// Obtener todos los reportes generados por un usuario
router.get("/usuario/:idUsuario", getReportesByUsuario);

export default router;

