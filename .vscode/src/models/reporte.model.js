import db from "../config/db.js";

/**
 * KPI 1: Resumen de ventas en un rango de fechas
 * @param {string} fecha_inicio - Formato YYYY-MM-DD
 * @param {string} fecha_fin - Formato YYYY-MM-DD
 * @returns {Object} { total_contratos, valor_total, promedio_venta }
 */
export const getResumenVentas = async (fecha_inicio, fecha_fin) => {
  const [rows] = await db.query(
    `SELECT 
      COUNT(*) as total_contratos,
      COALESCE(SUM(valor_venta), 0) as valor_total,
      COALESCE(AVG(valor_venta), 0) as promedio_venta
    FROM contrato
    WHERE fecha_venta BETWEEN ? AND ?
    AND estado_contrato != 'Anulado'`,
    [fecha_inicio, fecha_fin]
  );
  return rows[0];
};

/**
 * KPI 2: Ventas por agente en rango de fechas
 * @param {string} fecha_inicio
 * @param {string} fecha_fin
 * @returns {Array} Lista de agentes con sus ventas
 */
export const getVentasPorAgente = async (fecha_inicio, fecha_fin) => {
  const [rows] = await db.query(
    `SELECT 
      u.id_usuario,
      u.nombre,
      u.apellido,
      COUNT(c.id_contrato) as total_contratos,
      COALESCE(SUM(c.valor_venta), 0) as valor_total,
      COALESCE(AVG(c.valor_venta), 0) as promedio_venta
    FROM usuario u
    LEFT JOIN contrato c ON u.id_usuario = c.id_usuario 
      AND c.fecha_venta BETWEEN ? AND ?
      AND c.estado_contrato != 'Anulado'
    WHERE u.id_rol = 2
    GROUP BY u.id_usuario, u.nombre, u.apellido
    ORDER BY valor_total DESC`,
    [fecha_inicio, fecha_fin]
  );
  return rows;
};

/**
 * KPI 3: Ventas por localidad
 * @param {string} fecha_inicio
 * @param {string} fecha_fin
 * @returns {Array} Localidades con total de ventas
 */
export const getVentasPorLocalidad = async (fecha_inicio, fecha_fin) => {
  const [rows] = await db.query(
    `SELECT 
      l.id_localidad,
      l.nombre_localidad,
      COUNT(c.id_contrato) as total_contratos,
      COALESCE(SUM(c.valor_venta), 0) as valor_total,
      COALESCE(AVG(p.precio_propiedad), 0) as precio_promedio
    FROM localidad l
    LEFT JOIN barrio b ON l.id_localidad = b.id_localidad
    LEFT JOIN propiedad p ON b.id_barrio = p.id_barrio
    LEFT JOIN contrato c ON p.id_propiedad = c.id_propiedad
      AND c.fecha_venta BETWEEN ? AND ?
      AND c.estado_contrato != 'Anulado'
    GROUP BY l.id_localidad, l.nombre_localidad
    HAVING total_contratos > 0
    ORDER BY valor_total DESC`,
    [fecha_inicio, fecha_fin]
  );
  return rows;
};

/**
 * KPI 4: Distribución de propiedades por estado
 * @returns {Array} Conteo por cada estado
 */
export const getPropiedadesPorEstado = async () => {
  const [rows] = await db.query(
    `SELECT 
      estado_propiedad,
      COUNT(*) as total,
      COALESCE(AVG(precio_propiedad), 0) as precio_promedio
    FROM propiedad
    GROUP BY estado_propiedad
    ORDER BY total DESC`
  );
  return rows;
};

/**
 * KPI 5: Top propiedades con más intereses en rango de fechas
 * @param {string} fecha_inicio
 * @param {string} fecha_fin
 * @param {number} limit - Número de resultados
 * @returns {Array} Propiedades más interesadas
 */
export const getTopPropiedadesIntereses = async (fecha_inicio, fecha_fin, limit = 10) => {
  const [rows] = await db.query(
    `SELECT 
      p.id_propiedad,
      p.tipo_propiedad,
      p.direccion_formato,
      p.precio_propiedad,
      p.estado_propiedad,
      l.nombre_localidad,
      b.nombre_barrio,
      COUNT(i.id_interes) as total_intereses,
      COUNT(DISTINCT i.id_cliente) as clientes_unicos
    FROM propiedad p
    INNER JOIN interes_propiedad i ON p.id_propiedad = i.id_propiedad
    LEFT JOIN barrio b ON p.id_barrio = b.id_barrio
    LEFT JOIN localidad l ON b.id_localidad = l.id_localidad
    WHERE i.fecha_registro BETWEEN ? AND ?
    GROUP BY p.id_propiedad, p.tipo_propiedad, p.direccion_formato, 
             p.precio_propiedad, p.estado_propiedad, l.nombre_localidad, b.nombre_barrio
    ORDER BY total_intereses DESC
    LIMIT ?`,
    [fecha_inicio, fecha_fin, limit]
  );
  return rows;
};

/**
 * KPI 6: Funnel de conversión (intereses → visitas → contratos)
 * @param {string} fecha_inicio
 * @param {string} fecha_fin
 * @returns {Object} Métricas del funnel
 */
export const getFunnelConversion = async (fecha_inicio, fecha_fin) => {
  // Total de intereses
  const [intereses] = await db.query(
    `SELECT COUNT(*) as total FROM interes_propiedad WHERE fecha_registro BETWEEN ? AND ?`,
    [fecha_inicio, fecha_fin]
  );
  
  // Total de visitas
  const [visitas] = await db.query(
    `SELECT COUNT(*) as total FROM visita WHERE fecha_visita BETWEEN ? AND ?`,
    [fecha_inicio, fecha_fin]
  );
  
  // Total de contratos
  const [contratos] = await db.query(
    `SELECT COUNT(*) as total FROM contrato 
     WHERE fecha_contrato BETWEEN ? AND ? AND estado_contrato != 'Anulado'`,
    [fecha_inicio, fecha_fin]
  );

  const totalIntereses = intereses[0].total;
  const totalVisitas = visitas[0].total;
  const totalContratos = contratos[0].total;

  return {
    intereses: totalIntereses,
    visitas: totalVisitas,
    contratos: totalContratos,
    tasa_interes_visita: totalIntereses > 0 ? ((totalVisitas / totalIntereses) * 100).toFixed(2) : 0,
    tasa_visita_contrato: totalVisitas > 0 ? ((totalContratos / totalVisitas) * 100).toFixed(2) : 0,
    tasa_interes_contrato: totalIntereses > 0 ? ((totalContratos / totalIntereses) * 100).toFixed(2) : 0
  };
};

/**
 * KPI 7: Clientes nuevos registrados en rango
 * @param {string} fecha_inicio
 * @param {string} fecha_fin
 * @returns {Object} Total de clientes nuevos
 */
export const getClientesNuevos = async (fecha_inicio, fecha_fin) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) as total_nuevos
    FROM cliente
    WHERE fecha_registro BETWEEN ? AND ?`,
    [fecha_inicio, fecha_fin]
  );
  return rows[0];
};

/**
 * KPI 8: Tiempo promedio de ciclo de venta
 * @param {string} fecha_inicio
 * @param {string} fecha_fin
 * @returns {Object} Días promedio desde contrato hasta venta
 */
export const getTiempoPromedioCiclo = async (fecha_inicio, fecha_fin) => {
  const [rows] = await db.query(
    `SELECT 
      AVG(DATEDIFF(fecha_venta, fecha_contrato)) as dias_promedio,
      MIN(DATEDIFF(fecha_venta, fecha_contrato)) as dias_minimo,
      MAX(DATEDIFF(fecha_venta, fecha_contrato)) as dias_maximo
    FROM contrato
    WHERE fecha_venta BETWEEN ? AND ?
    AND estado_contrato != 'Anulado'
    AND fecha_venta IS NOT NULL`,
    [fecha_inicio, fecha_fin]
  );
  return rows[0];
};

/**
 * KPI 9: Propiedades sin actividad reciente
 * @param {number} dias - Días sin actividad
 * @returns {Array} Propiedades inactivas
 */
export const getPropiedadesSinActividad = async (dias = 30) => {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - dias);
  const fecha = fechaLimite.toISOString().split('T')[0];

  const [rows] = await db.query(
    `SELECT 
      p.id_propiedad,
      p.tipo_propiedad,
      p.direccion_formato,
      p.precio_propiedad,
      p.estado_propiedad,
      p.fecha_registro,
      l.nombre_localidad,
      b.nombre_barrio,
      COALESCE(MAX(v.fecha_visita), p.fecha_registro) as ultima_actividad,
      COUNT(DISTINCT i.id_interes) as total_intereses,
      COUNT(DISTINCT v.id_visita) as total_visitas
    FROM propiedad p
    LEFT JOIN barrio b ON p.id_barrio = b.id_barrio
    LEFT JOIN localidad l ON b.id_localidad = l.id_localidad
    LEFT JOIN visita v ON p.id_propiedad = v.id_propiedad AND v.fecha_visita >= ?
    LEFT JOIN interes_propiedad i ON p.id_propiedad = i.id_propiedad AND i.fecha_registro >= ?
    WHERE p.estado_propiedad = 'Disponible'
    GROUP BY p.id_propiedad, p.tipo_propiedad, p.direccion_formato, 
             p.precio_propiedad, p.estado_propiedad, p.fecha_registro,
             l.nombre_localidad, b.nombre_barrio
    HAVING total_intereses = 0 AND total_visitas = 0
    ORDER BY p.fecha_registro ASC`,
    [fecha, fecha]
  );
  return rows;
};

/**
 * Dashboard general: todas las métricas principales
 * @param {string} fecha_inicio
 * @param {string} fecha_fin
 * @returns {Object} Objeto con todos los KPIs
 */
export const getDashboardCompleto = async (fecha_inicio, fecha_fin) => {
  const [resumenVentas, ventasAgentes, ventasLocalidades, propiedadesEstado, 
         topPropiedades, funnel, clientesNuevos, tiempoCiclo] = await Promise.all([
    getResumenVentas(fecha_inicio, fecha_fin),
    getVentasPorAgente(fecha_inicio, fecha_fin),
    getVentasPorLocalidad(fecha_inicio, fecha_fin),
    getPropiedadesPorEstado(),
    getTopPropiedadesIntereses(fecha_inicio, fecha_fin, 5),
    getFunnelConversion(fecha_inicio, fecha_fin),
    getClientesNuevos(fecha_inicio, fecha_fin),
    getTiempoPromedioCiclo(fecha_inicio, fecha_fin)
  ]);

  return {
    periodo: { fecha_inicio, fecha_fin },
    resumen_ventas: resumenVentas,
    ventas_por_agente: ventasAgentes,
    ventas_por_localidad: ventasLocalidades,
    propiedades_por_estado: propiedadesEstado,
    top_propiedades_intereses: topPropiedades,
    funnel_conversion: funnel,
    clientes_nuevos: clientesNuevos,
    tiempo_ciclo_venta: tiempoCiclo
  };
};
