import db from "../config/db.js";
import { cacheGet, cacheSet } from "../utils/cache.js";
import {
  getResumenVentas,
  getVentasPorAgente,
  getVentasPorLocalidad,
  getPropiedadesPorEstado,
  getTopPropiedadesIntereses,
  getFunnelConversion,
  getClientesNuevos,
  getTiempoPromedioCiclo,
  getPropiedadesSinActividad,
  getDashboardCompleto
} from "../models/reporte.model.js";

// Helper: validar y obtener rango de fechas de query params
const obtenerRangoFechas = (req) => {
  const { fecha_inicio, fecha_fin } = req.query;
  
  // Si no se proporcionan, usar últimos 30 días
  if (!fecha_inicio || !fecha_fin) {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);
    
    return {
      fecha_inicio: hace30Dias.toISOString().split('T')[0],
      fecha_fin: hoy.toISOString().split('T')[0]
    };
  }
  
  // Validar formato de fechas
  if (new Date(fecha_inicio) > new Date(fecha_fin)) {
    throw new Error("La fecha de inicio no puede ser mayor a la fecha fin");
  }
  
  return { fecha_inicio, fecha_fin };
};

//  Obtener todos los reportes de ventas generados
export const getReportes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM reporte_ventas");
    res.json(rows); // Devuelve todos los reportes existentes
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reportes", error });
  }
};

//  Obtener un reporte específico por su ID
export const getReporteById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM reporte_ventas WHERE id_reporte = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    res.json(rows[0]); // Devuelve el reporte si existe
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reporte", error });
  }
};


// Crear reporte de ventas con validaciones
export const createReporte = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, id_usuario } = req.body;

    if (!fecha_inicio || !fecha_fin || !id_usuario) {
      return res.status(400).json({ message: "Todos los campos obligatorios deben estar completos" });
    }

    // Validar rango de fechas
    if (new Date(fecha_inicio) > new Date(fecha_fin)) {
      return res.status(400).json({ message: "La fecha de inicio no puede ser mayor a la fecha fin" });
    }

    // Verificar existencia de usuario
    const [usuario] = await db.query("SELECT * FROM usuario WHERE id_usuario = ?", [id_usuario]);
    if (usuario.length === 0) {
      return res.status(404).json({ message: "El usuario no existe" });
    }

    // Calcular total de ventas en ese rango
    const [ventas] = await db.query(
      "SELECT SUM(valor_venta) AS total FROM contrato WHERE fecha_contrato BETWEEN ? AND ? AND id_usuario = ?",
      [fecha_inicio, fecha_fin, id_usuario]
    );

    const total_ventas = ventas[0].total || 0;

    // Insertar reporte
    const [result] = await db.query(
      `INSERT INTO reporte_ventas (fecha_inicio, fecha_fin, total_ventas, id_usuario) 
       VALUES (?, ?, ?, ?)`,
      [fecha_inicio, fecha_fin, total_ventas, id_usuario]
    );

    res.status(201).json({
      message: "Reporte creado exitosamente",
      reporteId: result.insertId,
      total_ventas,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear reporte", error });
  }
};

//  Obtener todos los reportes generados por un usuario específico
export const getReportesByUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM reporte_ventas WHERE id_usuario = ?",
      [idUsuario]
    );

    res.json(rows); // Devuelve todos los reportes del usuario
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reportes por usuario", error });
  }
};

//  Obtener el total de ventas en un rango de fechas (sin crear un reporte)
export const getTotalVentas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    // Validación: ambas fechas son necesarias
    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ message: "Debes enviar fecha_inicio y fecha_fin" });
    }

    const [ventas] = await db.query(
      `SELECT SUM(valor_venta) AS total_ventas 
       FROM contrato 
       WHERE fecha_venta BETWEEN ? AND ?`,
      [fecha_inicio, fecha_fin]
    );

    res.json({
      fecha_inicio,
      fecha_fin,
      total_ventas: ventas[0].total_ventas || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener total de ventas", error });
  }
};

// Reporte especial: rendimiento de cada agente
export const getRendimientoAgentes = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ message: "Debes enviar fecha_inicio y fecha_fin" });
    }

    const [rows] = await db.query(
      `SELECT 
          u.id_usuario,
          u.nombre,
          u.apellido,
          COUNT(c.id_contrato) AS contratos_realizados,
          COALESCE(SUM(c.valor_venta), 0) AS total_ventas
       FROM usuario u
       LEFT JOIN contrato c ON u.id_usuario = c.id_usuario 
         AND c.fecha_venta BETWEEN ? AND ?
       GROUP BY u.id_usuario, u.nombre, u.apellido
       ORDER BY total_ventas DESC`,
      [fecha_inicio, fecha_fin]
    );

    res.json({
      fecha_inicio,
      fecha_fin,
      agentes: rows
    });
  } catch (error) {
    res.status(500).json({ message: "Error al generar reporte de agentes", error });
  }
};



//  Obtener reporte de cantidad de clientes con estado "Activo"
export const getClientesActivos = async (req, res) => {
  try {
    //  Consulta SQL: cuenta todos los clientes cuyo estado sea "Activo"
    const [rows] = await db.query(
      `SELECT COUNT(*) AS total_activos 
       FROM cliente 
       WHERE estado_cliente = 'Activo'`
    );

    //  Extrae el número total de activos desde el resultado
    const totalActivos = rows[0]?.total_activos || 0;

    //  Si no hay clientes activos, se responde con un mensaje claro
    if (totalActivos === 0) {
      return res.status(200).json({
        message: "No hay clientes activos actualmente",
        total_activos: 0,
      });
    }

    //  Si hay clientes activos, se devuelve el total
    res.status(200).json({
      message: "Reporte de clientes activos generado correctamente",
      total_activos: totalActivos,
    });
    
  } catch (error) {
    //  Manejo de errores: log y respuesta con mensaje de fallo
    console.error("❌ Error generando reporte de clientes activos:", error);
    res.status(500).json({
      message: "Error al generar el reporte de clientes activos",
      error: error.message,
    });
  }
};

//  Obtener reporte de propiedades con estado "Disponible"
export const getPropiedadesDisponibles = async (req, res) => {
  try {
    //  Consulta SQL: selecciona propiedades que estén disponibles
    const [rows] = await db.query(
      `SELECT 
         id_propiedad, 
         tipo_propiedad, 
         direccion_formato, 
         precio_propiedad, 
         estado_propiedad
       FROM propiedad
       WHERE estado_propiedad = 'Disponible'`
    );

    //  Si no hay propiedades disponibles, devuelve mensaje claro
    if (rows.length === 0) {
      return res.status(200).json({
        message: "No hay propiedades disponibles actualmente",
        total_disponibles: 0,
        propiedades: [], // Lista vacía
      });
    }

    //  Devuelve lista de propiedades disponibles y su cantidad
    res.status(200).json({
      message: "Reporte de propiedades disponibles generado correctamente",
      total_disponibles: rows.length,
      propiedades: rows, // Lista con info de propiedades
    });

  } catch (error) {
    //  Manejo de errores
    console.error("❌ Error generando reporte de propiedades disponibles:", error);
    res.status(500).json({
      message: "Error al generar el reporte de propiedades disponibles",
      error: error.message,
    });
  }
};


//  Obtener reporte de ventas realizadas (propiedades con estado 'Vendida')
export const getVentasRealizadas = async (req, res) => {
  try {
    //  Consulta SQL:
    // Se obtienen contratos relacionados a propiedades vendidas
    const [rows] = await db.query(
      `SELECT 
         c.id_contrato, 
         p.tipo_propiedad, 
         p.direccion_formato, 
         c.valor_venta, 
         c.fecha_venta
       FROM contrato c
       INNER JOIN propiedad p ON c.id_propiedad = p.id_propiedad
       WHERE p.estado_propiedad = 'Vendida'`
    );

    //  Inicializamos el total de ingresos por ventas
    let totalVentas = 0;

    //  Sumamos el valor de cada venta
    rows.forEach(r => totalVentas += parseFloat(r.valor_venta));

    //  Si no hay ventas, devolvemos una respuesta clara
    if (rows.length === 0) {
      return res.status(200).json({
        message: "No hay ventas registradas actualmente",
        total_ventas: 0,         // Cantidad de ventas realizadas
        total_ingresos: 0,       // Monto total ingresado por ventas
        ventas: [],              // Lista vacía de ventas
      });
    }

    //  Si hay ventas, devolvemos los datos con métricas
    res.status(200).json({
      message: "Reporte de ventas generado correctamente",
      total_ventas: rows.length,  // Número de ventas registradas
      total_ingresos: totalVentas, // Suma de todos los valores de venta
      ventas: rows,               // Detalle de cada venta
    });

  } catch (error) {
    //  Manejo de errores
    console.error("❌ Error generando reporte de ventas:", error);
    res.status(500).json({
      message: "Error al generar el reporte de ventas",
      error: error.message,
    });
  }
};

// ========== NUEVOS ENDPOINTS DE REPORTES ==========

/**
 * GET /api/reportes/dashboard
 * Dashboard completo con todos los KPIs principales
 */
export const getDashboard = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = obtenerRangoFechas(req);
    const key = `dashboard|${fecha_inicio}|${fecha_fin}`;
    const forceRefresh = req.query.refresh === '1' || req.query.refresh === 1;
    if (!forceRefresh) {
      const cached = cacheGet(key);
      if (cached) {
        return res.json({ ...cached.data, meta: { cache: true, generated_at: new Date(cached.createdAt).toISOString(), ttl_ms: cached.expires - Date.now() } });
      }
    }
    const dashboard = await getDashboardCompleto(fecha_inicio, fecha_fin);
    cacheSet(key, dashboard, 60000); // TTL 60s
    res.json({ ...dashboard, meta: { cache: false } });
  } catch (error) {
    console.error("❌ Error obteniendo dashboard:", error);
    res.status(500).json({ message: "Error al obtener dashboard", error: error.message });
  }
};

/**
 * GET /api/reportes/ventas/resumen
 * Resumen de ventas en rango de fechas
 */
export const getResumenVentasController = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = obtenerRangoFechas(req);
    const key = `ventas_resumen|${fecha_inicio}|${fecha_fin}`;
    const cached = cacheGet(key);
    if (cached) {
      return res.json({ periodo: { fecha_inicio, fecha_fin }, ...cached.data, meta: { cache: true } });
    }
    const resumen = await getResumenVentas(fecha_inicio, fecha_fin);
    cacheSet(key, resumen, 60000);
    res.json({ periodo: { fecha_inicio, fecha_fin }, ...resumen, meta: { cache: false } });
  } catch (error) {
    console.error("❌ Error obteniendo resumen de ventas:", error);
    res.status(500).json({ message: "Error al obtener resumen de ventas", error: error.message });
  }
};

/**
 * GET /api/reportes/ventas/agentes
 * Ventas por agente en rango de fechas
 */
export const getVentasPorAgenteController = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = obtenerRangoFechas(req);
    const key = `ventas_agentes|${fecha_inicio}|${fecha_fin}`;
    const cached = cacheGet(key);
    if (cached) {
      return res.json({ periodo: { fecha_inicio, fecha_fin }, agentes: cached.data, meta: { cache: true } });
    }
    const agentes = await getVentasPorAgente(fecha_inicio, fecha_fin);
    cacheSet(key, agentes, 60000);
    res.json({ periodo: { fecha_inicio, fecha_fin }, agentes, meta: { cache: false } });
  } catch (error) {
    console.error("❌ Error obteniendo ventas por agente:", error);
    res.status(500).json({ message: "Error al obtener ventas por agente", error: error.message });
  }
};

/**
 * GET /api/reportes/ventas/localidades
 * Ventas por localidad en rango de fechas
 */
export const getVentasPorLocalidadController = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = obtenerRangoFechas(req);
    const key = `ventas_localidades|${fecha_inicio}|${fecha_fin}`;
    const cached = cacheGet(key);
    if (cached) {
      return res.json({ periodo: { fecha_inicio, fecha_fin }, localidades: cached.data, meta: { cache: true } });
    }
    const localidades = await getVentasPorLocalidad(fecha_inicio, fecha_fin);
    cacheSet(key, localidades, 120000); // TTL 120s para agregación más pesada
    res.json({ periodo: { fecha_inicio, fecha_fin }, localidades, meta: { cache: false } });
  } catch (error) {
    console.error("❌ Error obteniendo ventas por localidad:", error);
    res.status(500).json({ message: "Error al obtener ventas por localidad", error: error.message });
  }
};

/**
 * GET /api/reportes/propiedades/estado
 * Distribución de propiedades por estado
 */
export const getPropiedadesPorEstadoController = async (req, res) => {
  try {
    const key = `propiedades_estado`;
    const cached = cacheGet(key);
    if (cached) {
      return res.json({ estados: cached.data, meta: { cache: true } });
    }
    const estados = await getPropiedadesPorEstado();
    cacheSet(key, estados, 300000); // TTL 5 min, poco cambiante
    res.json({ estados, meta: { cache: false } });
  } catch (error) {
    console.error("❌ Error obteniendo propiedades por estado:", error);
    res.status(500).json({ message: "Error al obtener propiedades por estado", error: error.message });
  }
};

/**
 * GET /api/reportes/propiedades/top-intereses
 * Top propiedades con más intereses
 */
export const getTopPropiedadesInteresesController = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = obtenerRangoFechas(req);
    const limit = parseInt(req.query.limit) || 10;
    const key = `top_intereses|${fecha_inicio}|${fecha_fin}|${limit}`;
    const cached = cacheGet(key);
    if (cached) {
      return res.json({ periodo: { fecha_inicio, fecha_fin }, propiedades: cached.data, meta: { cache: true } });
    }
    const propiedades = await getTopPropiedadesIntereses(fecha_inicio, fecha_fin, limit);
    cacheSet(key, propiedades, 60000);
    res.json({ periodo: { fecha_inicio, fecha_fin }, propiedades, meta: { cache: false } });
  } catch (error) {
    console.error("❌ Error obteniendo top propiedades:", error);
    res.status(500).json({ message: "Error al obtener top propiedades", error: error.message });
  }
};

/**
 * GET /api/reportes/funnel
 * Funnel de conversión intereses → visitas → contratos
 */
export const getFunnelController = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = obtenerRangoFechas(req);
    const key = `funnel|${fecha_inicio}|${fecha_fin}`;
    const cached = cacheGet(key);
    if (cached) {
      return res.json({ periodo: { fecha_inicio, fecha_fin }, funnel: cached.data, meta: { cache: true } });
    }
    const funnel = await getFunnelConversion(fecha_inicio, fecha_fin);
    cacheSet(key, funnel, 60000);
    res.json({ periodo: { fecha_inicio, fecha_fin }, funnel, meta: { cache: false } });
  } catch (error) {
    console.error("❌ Error obteniendo funnel:", error);
    res.status(500).json({ message: "Error al obtener funnel de conversión", error: error.message });
  }
};

/**
 * GET /api/reportes/clientes/nuevos
 * Clientes nuevos registrados en rango
 */
export const getClientesNuevosController = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = obtenerRangoFechas(req);
    const key = `clientes_nuevos|${fecha_inicio}|${fecha_fin}`;
    const cached = cacheGet(key);
    if (cached) {
      return res.json({ periodo: { fecha_inicio, fecha_fin }, ...cached.data, meta: { cache: true } });
    }
    const clientes = await getClientesNuevos(fecha_inicio, fecha_fin);
    cacheSet(key, clientes, 60000);
    res.json({ periodo: { fecha_inicio, fecha_fin }, ...clientes, meta: { cache: false } });
  } catch (error) {
    console.error("❌ Error obteniendo clientes nuevos:", error);
    res.status(500).json({ message: "Error al obtener clientes nuevos", error: error.message });
  }
};

/**
 * GET /api/reportes/ventas/tiempo-ciclo
 * Tiempo promedio de ciclo de venta
 */
export const getTiempoCicloController = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = obtenerRangoFechas(req);
    const key = `tiempo_ciclo|${fecha_inicio}|${fecha_fin}`;
    const cached = cacheGet(key);
    if (cached) {
      return res.json({ periodo: { fecha_inicio, fecha_fin }, ...cached.data, meta: { cache: true } });
    }
    const ciclo = await getTiempoPromedioCiclo(fecha_inicio, fecha_fin);
    cacheSet(key, ciclo, 120000);
    res.json({ periodo: { fecha_inicio, fecha_fin }, ...ciclo, meta: { cache: false } });
  } catch (error) {
    console.error("❌ Error obteniendo tiempo de ciclo:", error);
    res.status(500).json({ message: "Error al obtener tiempo de ciclo", error: error.message });
  }
};

/**
 * GET /api/reportes/propiedades/sin-actividad
 * Propiedades sin actividad reciente
 */
export const getPropiedadesSinActividadController = async (req, res) => {
  try {
    const dias = parseInt(req.query.dias) || 30;
    const propiedades = await getPropiedadesSinActividad(dias);
    res.json({ dias_sin_actividad: dias, propiedades });
  } catch (error) {
    console.error("❌ Error obteniendo propiedades sin actividad:", error);
    res.status(500).json({ message: "Error al obtener propiedades sin actividad", error: error.message });
  }
};

