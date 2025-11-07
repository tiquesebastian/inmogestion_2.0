// src/services/api.js

// Base URL: usa variable de entorno si existe, si no, cae al proxy /api.
// Simplificamos a acceso directo porque este archivo solo corre en entorno Vite (frontend).
let API_BASE = "/api";
try {
  if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
    API_BASE = import.meta.env.VITE_API_URL;
  }
} catch (_) {
  // Ignorar si import.meta no está disponible (fallback ya definido)
}

// Helper: construye query string a partir de un objeto
const toQuery = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.append(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : "";
};

// Helper: wrapper fetch con manejo de errores y JSON automático
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Accept': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();
  let data = text;
  if (contentType.includes('application/json')) {
    try { data = JSON.parse(text); } catch (e) { /* ignore */ }
  }
  if (!res.ok) {
    const message = (data && data.message) || `Error ${res.status}`;
    throw new Error(message);
  }
  return data;
}

// ==== Subir archivo (Carga Masiva) ====
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch(`/upload`, { method: 'POST', body: formData });
}

// ==== Propiedades ====
export async function getProperties(params = {}) {
  // Intenta usar el endpoint de filtro si hay parámetros, o lista general si no
  const hasFilters = Object.values(params).some((v) => v !== undefined && v !== null && v !== "");
  const path = hasFilters ? `/propiedades/filter${toQuery(params)}` : `/propiedades`;
  try {
    return await apiFetch(path);
  } catch (e) {
    // Fallback: devuelve arreglo vacío si backend aún no está listo
    console.warn('getProperties fallback (mock):', e.message);
    return [];
  }
}

export async function createProperty(payload) {
  // Si no existe backend para crear, lanza error controlado por ahora
  try {
    return await apiFetch(`/propiedades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    throw new Error('Crear propiedad no disponible aún en el backend');
  }
}

// ==== Localidades y Barrios ====
export async function getLocalidades() {
  try {
    return await apiFetch(`/localidades`);
  } catch (e) {
    // Mock fallback
    console.warn('getLocalidades fallback (mock):', e.message);
    return [
      { id_localidad: 1, nombre_localidad: 'Usaquén' },
      { id_localidad: 2, nombre_localidad: 'Chapinero' },
      { id_localidad: 3, nombre_localidad: 'Suba' },
      { id_localidad: 4, nombre_localidad: 'Engativá' },
      { id_localidad: 5, nombre_localidad: 'Fontibón' },
    ];
  }
}

export async function getBarriosByLocalidad(idLocalidad) {
  try {
    return await apiFetch(`/barrios?id_localidad=${idLocalidad}`);
  } catch (e) {
    // Mock fallback
    console.warn('getBarriosByLocalidad fallback (mock):', e.message);
    return [
      { id_barrio: 1, nombre_barrio: 'Santa Bárbara', id_localidad: idLocalidad },
      { id_barrio: 2, nombre_barrio: 'Verbenal', id_localidad: idLocalidad },
      { id_barrio: 3, nombre_barrio: 'San Cristóbal Norte', id_localidad: idLocalidad },
    ];
  }
}

export async function updatePropertyState(id, estado) {
  try {
    return await apiFetch(`/propiedades/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    });
  } catch (e) {
    throw new Error('Actualizar estado no disponible aún en el backend');
  }
}

// ==== Usuarios (mock) ====
export async function getUsers() {
  // Mock temporal hasta tener endpoint real
  return [
    { id_usuario: 1, nombre: 'Admin', email: 'admin@inmogestion.com', rol: 'Administrador', estado: 'Activo' },
    { id_usuario: 2, nombre: 'Ana Agente', email: 'agente.ana@inmogestion.com', rol: 'Agente', estado: 'Activo' },
    { id_usuario: 3, nombre: 'Luis Cliente', email: 'luis@mail.com', rol: 'Cliente', estado: 'Activo' },
  ];
}

// ==== Agente ====
export async function getAgentProperties(idAgente) {
  const all = await getProperties();
  // Filtro simple: cuando el backend no devuelve asignación, mostramos todas como demo
  return all.filter(() => true);
}

export async function createVisit({ id_propiedad, id_cliente, id_agente, fecha_visita, notas }) {
  return apiFetch(`/visitas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_propiedad, id_cliente, id_agente, fecha_visita, notas }),
  });
}

// ==== Reportes (mock) ====
export async function getReports() {
  const propiedades = await getProperties();
  // KPIs simples
  return {
    totalPropiedades: propiedades.length,
    propiedadesActivas: propiedades.filter(p => (p.estado_propiedad || 'Activa') === 'Activa').length,
    clientes: 12,
    visitasProgramadas: 5,
    ventas: 2,
    topLocalidades: [
      { nombre: 'Chapinero', total: 5 },
      { nombre: 'Usaquén', total: 4 },
      { nombre: 'Suba', total: 3 },
    ],
  };
}

// ==== Reportes Dashboard (nuevos endpoints) ====
/**
 * Dashboard completo con todos los KPIs
 * @param {string} fecha_inicio - YYYY-MM-DD (opcional)
 * @param {string} fecha_fin - YYYY-MM-DD (opcional)
 */
export async function getDashboard(fecha_inicio = null, fecha_fin = null) {
  try {
    const params = {};
    if (fecha_inicio) params.fecha_inicio = fecha_inicio;
    if (fecha_fin) params.fecha_fin = fecha_fin;
    return await apiFetch(`/reportes/dashboard${toQuery(params)}`);
  } catch (e) {
    console.warn('getDashboard fallback (error):', e.message);
    throw e;
  }
}

/**
 * Resumen de ventas
 */
export async function getResumenVentas(fecha_inicio = null, fecha_fin = null) {
  try {
    const params = {};
    if (fecha_inicio) params.fecha_inicio = fecha_inicio;
    if (fecha_fin) params.fecha_fin = fecha_fin;
    return await apiFetch(`/reportes/ventas/resumen${toQuery(params)}`);
  } catch (e) {
    console.warn('getResumenVentas error:', e.message);
    throw e;
  }
}

/**
 * Ventas por agente
 */
export async function getVentasPorAgente(fecha_inicio = null, fecha_fin = null) {
  try {
    const params = {};
    if (fecha_inicio) params.fecha_inicio = fecha_inicio;
    if (fecha_fin) params.fecha_fin = fecha_fin;
    return await apiFetch(`/reportes/ventas/agentes${toQuery(params)}`);
  } catch (e) {
    console.warn('getVentasPorAgente error:', e.message);
    throw e;
  }
}

/**
 * Ventas por localidad
 */
export async function getVentasPorLocalidad(fecha_inicio = null, fecha_fin = null) {
  try {
    const params = {};
    if (fecha_inicio) params.fecha_inicio = fecha_inicio;
    if (fecha_fin) params.fecha_fin = fecha_fin;
    return await apiFetch(`/reportes/ventas/localidades${toQuery(params)}`);
  } catch (e) {
    console.warn('getVentasPorLocalidad error:', e.message);
    throw e;
  }
}

/**
 * Propiedades por estado
 */
export async function getPropiedadesPorEstado() {
  try {
    return await apiFetch(`/reportes/propiedades/estado`);
  } catch (e) {
    console.warn('getPropiedadesPorEstado error:', e.message);
    throw e;
  }
}

/**
 * Top propiedades con más intereses
 */
export async function getTopPropiedadesIntereses(fecha_inicio = null, fecha_fin = null, limit = 10) {
  try {
    const params = { limit };
    if (fecha_inicio) params.fecha_inicio = fecha_inicio;
    if (fecha_fin) params.fecha_fin = fecha_fin;
    return await apiFetch(`/reportes/propiedades/top-intereses${toQuery(params)}`);
  } catch (e) {
    console.warn('getTopPropiedadesIntereses error:', e.message);
    throw e;
  }
}

/**
 * Funnel de conversión
 */
export async function getFunnelConversion(fecha_inicio = null, fecha_fin = null) {
  try {
    const params = {};
    if (fecha_inicio) params.fecha_inicio = fecha_inicio;
    if (fecha_fin) params.fecha_fin = fecha_fin;
    return await apiFetch(`/reportes/funnel${toQuery(params)}`);
  } catch (e) {
    console.warn('getFunnelConversion error:', e.message);
    throw e;
  }
}

/**
 * Propiedades sin actividad
 */
export async function getPropiedadesSinActividad(dias = 30) {
  try {
    return await apiFetch(`/reportes/propiedades/sin-actividad?dias=${dias}`);
  } catch (e) {
    console.warn('getPropiedadesSinActividad error:', e.message);
    throw e;
  }
}


// ==== Imágenes de Propiedades ====
export async function getImagenesByPropiedad(idPropiedad) {
  try {
    return await apiFetch(`/imagenes/propiedad/${idPropiedad}`);
  } catch (e) {
    console.warn('getImagenesByPropiedad fallback (mock):', e.message);
    // Retorna array vacío si no hay imágenes
    return [];
  }
}

export async function uploadImagenPropiedad(idPropiedad, file, prioridad = 0, descripcion = '') {
  const formData = new FormData();
  formData.append('imagen', file);
  formData.append('id_propiedad', idPropiedad);
  formData.append('prioridad', prioridad);
  if (descripcion) formData.append('descripcion', descripcion);
  
  try {
    return await apiFetch(`/imagenes/propiedad`, {
      method: 'POST',
      body: formData,
    });
  } catch (e) {
    throw new Error('Error al subir imagen: ' + e.message);
  }
}

// ==== Ejemplo: consumir saludo ====
export async function getSaludo() {
  return apiFetch(`/saludo`);
}
