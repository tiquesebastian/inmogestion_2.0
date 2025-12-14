// src/services/api.js

// Base URL: usa variable de entorno si existe, si no, cae al proxy /api (solo desarrollo).
// En producción (Vercel), usar URL absoluta del backend en Railway
let API_BASE = "/api";

// En producción, intentar usar URL absoluta del backend de Railway
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
  API_BASE = 'https://inmogestion20-production-fdf7.up.railway.app/api';
}

// Si existe VITE_API_URL, sobrescribir
try {
  const envUrl = import.meta?.env?.VITE_API_URL;
  if (envUrl) {
    API_BASE = envUrl;
  }
} catch (_) {
  // Ignorar si import.meta no está disponible
}

console.log('[API] API_BASE final:', API_BASE);
console.log('[API] hostname:', window?.location?.hostname);

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
  const silent = options.silent || false;
  const fullUrl = `${API_BASE}${path}`;
  const res = await fetch(fullUrl, {
    method: options.method || 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...(options.headers || {}) },
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
    const error = new Error(message);
    error.status = res.status;
    error.silent = silent;
    throw error;
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

export async function getPropertyById(id) {
  return apiFetch(`/propiedades/${id}`);
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

export async function updateProperty(id, payload) {
  return apiFetch(`/propiedades/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteProperty(id) {
  return apiFetch(`/propiedades/${id}`, { method: 'DELETE' });
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
  // Backend solo soporta PUT, no PATCH. Actualizar vía PUT con payload completo
  try {
    const p = await getPropertyById(id);
    // Recuperar id_usuario de la sesión activa
    let id_usuario = null;
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        id_usuario = user.id_usuario || user.id || null;
      }
    } catch (_) {}
    
    const payload = {
      tipo_propiedad: p.tipo_propiedad || p.tipo || '',
      direccion_formato: p.direccion_formato || p.direccion || '',
      precio_propiedad: p.precio_propiedad || p.precio || 0,
      area_m2: p.area_m2 || p.area || 0,
      num_habitaciones: p.num_habitaciones || p.habitaciones || 0,
      num_banos: p.num_banos || p.banos || 0,
      estado_propiedad: estado,
      descripcion: p.descripcion || '',
    };
    // Solo incluir id_barrio si existe y es válido
    if (p.id_barrio && p.id_barrio > 0) payload.id_barrio = p.id_barrio;
    // Incluir id_usuario si está disponible (backend lo requiere)
    if (id_usuario) payload.id_usuario = id_usuario;
    
    return await updateProperty(id, payload);
  } catch (e) {
    throw new Error('Error al actualizar estado: ' + (e.message || ''));
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

// Obtener lista de clientes
export async function getClientes() {
  try {
    const data = await apiFetch(`/clientes`);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    // Fallback mock
    console.warn('getClientes fallback (mock):', e.message);
    return [
      { id_cliente: 32, nombre_cliente: 'juan sebastian', correo_cliente: 'juan@example.com' },
      { id_cliente: 15, nombre_cliente: 'María García', correo_cliente: 'maria@example.com' },
      { id_cliente: 20, nombre_cliente: 'Carlos Pérez', correo_cliente: 'carlos@example.com' },
    ];
  }
}

// ==== Agente ====
export async function getAgentProperties(idAgente) {
  const all = await getProperties();
  // Filtro simple: cuando el backend no devuelve asignación, mostramos todas como demo
  return all.filter(() => true);
}

export async function createVisit({ id_propiedad, id_cliente, id_agente = null, fecha_visita, hora_visita = null, notas = '' }) {
  try {
    return await apiFetch(`/visitas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_propiedad, id_cliente, id_agente, fecha_visita, hora_visita, notas }),
    });
  } catch (e) {
    // Fallback local: almacenar visita en localStorage
    const key = `visitas_${id_cliente}`;
    const current = JSON.parse(localStorage.getItem(key) || '[]');
    const visita = {
      id_visita: Date.now(),
      id_propiedad,
      id_cliente,
      fecha_visita,
      hora_visita: hora_visita || '00:00',
      notas,
      estado_visita: 'Programada',
      _local: true
    };
    current.push(visita);
    localStorage.setItem(key, JSON.stringify(current));
    return visita;
  }
}

// Obtener visitas de un cliente (fallback silencioso si endpoint no existe)
export async function getVisitas(id_cliente) {
  try {
    const res = await fetch(`${API_BASE}/visitas?id_cliente=${id_cliente}`, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (res.status === 404) {
      // Endpoint no implementado: leer de localStorage
      const key = `visitas_${id_cliente}`;
      const current = JSON.parse(localStorage.getItem(key) || '[]');
      return { _fallback: true, data: current };
    }
    
    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }
    
    const data = await res.json();
    return { _fallback: false, data: Array.isArray(data) ? data : [] };
  } catch (e) {
    const key = `visitas_${id_cliente}`;
    const current = JSON.parse(localStorage.getItem(key) || '[]');
    return { _fallback: true, data: current };
  }
}

// Obtener todas las visitas (para admin/agente) sin filtrar por cliente
export async function getAllVisitas() {
  try {
    const res = await fetch(`${API_BASE}/visitas`, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (res.status === 404) {
      // Endpoint no implementado: recolectar de todos los localStorage
      const allVisitas = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('visitas_')) {
          const visitas = JSON.parse(localStorage.getItem(key) || '[]');
          allVisitas.push(...visitas);
        }
      }
      return { _fallback: true, data: allVisitas };
    }
    
    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }
    
    const data = await res.json();
    return { _fallback: false, data: Array.isArray(data) ? data : [] };
  } catch (e) {
    // Fallback: recolectar de todos los localStorage
    const allVisitas = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('visitas_')) {
        const visitas = JSON.parse(localStorage.getItem(key) || '[]');
        allVisitas.push(...visitas);
      }
    }
    return { _fallback: true, data: allVisitas };
  }
}

export async function cancelVisit(id_visita, id_cliente) {
  try {
    return await apiFetch(`/visitas/${id_visita}/cancelar`, { method: 'PATCH' });
  } catch (e) {
    // Fallback local: actualizar estado
    const key = `visitas_${id_cliente}`;
    const current = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = current.map(v => v.id_visita === id_visita ? { ...v, estado_visita: 'Cancelada', _local: true } : v);
    localStorage.setItem(key, JSON.stringify(updated));
    return { ok: true, id_visita, estado_visita: 'Cancelada', _local: true };
  }
}

export async function updateVisit({ id_visita, id_cliente, fecha_visita, hora_visita, notas }) {
  try {
    return await apiFetch(`/visitas/${id_visita}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fecha_visita, hora_visita, notas })
    });
  } catch (e) {
    // Fallback local: modificar la visita almacenada
    const key = `visitas_${id_cliente}`;
    const current = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = current.map(v => v.id_visita === id_visita ? { ...v, fecha_visita, hora_visita, notas, _local: true } : v);
    localStorage.setItem(key, JSON.stringify(updated));
    return { ok: true, id_visita, fecha_visita, hora_visita, notas, _local: true };
  }
}

// Reagendar visita para admin/agente (similar a updateVisit pero puede buscar en todos los localStorage)
export async function reagendarVisita({ id_visita, id_cliente, fecha_visita, hora_visita, notas }) {
  try {
    return await apiFetch(`/visitas/${id_visita}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fecha_visita, hora_visita, notas })
    });
  } catch (e) {
    // Fallback local: buscar en el localStorage del cliente específico
    const key = `visitas_${id_cliente}`;
    const current = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = current.map(v => v.id_visita === id_visita ? { ...v, fecha_visita, hora_visita, notas, _local: true } : v);
    localStorage.setItem(key, JSON.stringify(updated));
    return { ok: true, id_visita, fecha_visita, hora_visita, notas, _local: true };
  }
}

// ==== Interacciones (Interés en propiedad) ==== 
/**
 * Registrar interés de un cliente en una propiedad.
 * @param {Object} params
 * @param {number} params.id_propiedad
 * @param {number} params.id_cliente
 * @param {string} [params.comentarios]
 * @returns {Promise<any>} respuesta del backend o mock
 */
export async function registrarInteres({ id_propiedad, id_cliente, comentarios = '' }) {
  try {
    return await apiFetch(`/interacciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_propiedad, id_cliente, tipo_interaccion: 'interes', comentarios })
    });
  } catch (e) {
    console.warn('registrarInteres fallback (mock):', e.message);
    // Mock local: simula respuesta
    return {
      id_interaccion: Date.now(),
      id_propiedad,
      id_cliente,
      tipo_interaccion: 'interes',
      fecha_interaccion: new Date().toISOString(),
      comentarios,
      _mock: true
    };
  }
}

// Obtener interacciones (intereses) de un cliente
export async function getInteracciones(id_cliente) {
  try {
    const res = await fetch(`${API_BASE}/interacciones?id_cliente=${id_cliente}`, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (res.status === 404) {
      // Endpoint no disponible aún
      return { _fallback: true, data: [] };
    }
    
    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }
    
    const data = await res.json();
    return { _fallback: false, data: Array.isArray(data) ? data : [] };
  } catch (e) {
    return { _fallback: true, data: [] };
  }
}

// ==== Favoritos (solo localStorage por ahora, sin llamadas a backend) ==== 
/**
 * Añadir una propiedad a favoritos de un cliente (localStorage)
 */
export async function addFavorito({ id_propiedad, id_cliente }) {
  const key = `fav_${id_cliente}`;
  const current = JSON.parse(localStorage.getItem(key) || '[]');
  if (!current.includes(id_propiedad)) current.push(id_propiedad);
  localStorage.setItem(key, JSON.stringify(current));
  return { ok: true, id_propiedad, id_cliente, _local: true };
}

/**
 * Eliminar favorito (localStorage)
 */
export async function removeFavorito({ id_propiedad, id_cliente }) {
  const key = `fav_${id_cliente}`;
  const current = JSON.parse(localStorage.getItem(key) || '[]');
  const next = current.filter(id => id !== id_propiedad);
  localStorage.setItem(key, JSON.stringify(next));
  return { ok: true, removed: id_propiedad, _local: true };
}

/**
 * Obtener favoritos del cliente (localStorage)
 */
export async function getFavoritos(id_cliente) {
  const key = `fav_${id_cliente}`;
  try {
    const current = JSON.parse(localStorage.getItem(key) || '[]');
    return current.map(id => ({ id_propiedad: id, _local: true }));
  } catch (_) {
    return [];
  }
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
export async function getDashboard(fecha_inicio = null, fecha_fin = null, forceRefresh = false) {
  try {
    const params = {};
    if (fecha_inicio) params.fecha_inicio = fecha_inicio;
    if (fecha_fin) params.fecha_fin = fecha_fin;
    if (forceRefresh) params.refresh = 1;
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
// Resuelve diferentes formatos para construir una URL utilizable en el frontend
function resolveImageUrl(item) {
  if (!item) return null;
  // Si ya es una URL string
  if (typeof item === 'string') {
    if (item.startsWith('http')) return item;
    // Si tenemos una URL absoluta de API, prefijarla; si no, devolver ruta directa para usar proxy de Vite
    const apiIsAbsolute = typeof API_BASE === 'string' && API_BASE.startsWith('http');
    if (item.startsWith('/uploads')) return apiIsAbsolute ? `${API_BASE}${item}` : item;
    if (item.startsWith('uploads/')) return apiIsAbsolute ? `${API_BASE}/${item}` : `/${item}`;
    return item;
  }
  // Si es objeto, prueba campos conocidos
  const candidate = item.url || item.ruta || item.path || item.filepath || item.nombre_archivo || item.filename;
  if (!candidate) return null;
  if (typeof candidate === 'string') {
    if (candidate.startsWith('http')) return candidate;
    const apiIsAbsolute = typeof API_BASE === 'string' && API_BASE.startsWith('http');
    if (candidate.startsWith('/uploads')) return apiIsAbsolute ? `${API_BASE}${candidate}` : candidate;
    if (candidate.startsWith('uploads/')) return apiIsAbsolute ? `${API_BASE}/${candidate}` : `/${candidate}`;
    // si solo es un filename, construir ruta /uploads/<filename> (proxy lo servirá)
    return apiIsAbsolute ? `${API_BASE}/uploads/${candidate}` : `/uploads/${candidate}`;
  }
  return null;
}

export async function getImagenesByPropiedad(idPropiedad) {
  try {
    const data = await apiFetch(`/imagenes/propiedad/${idPropiedad}`);
    if (!Array.isArray(data)) return [];
    // Normaliza a lista de URLs listas para <img src="..." />
    const urls = data
      .map(resolveImageUrl)
      .filter(Boolean);
    return urls;
  } catch (e) {
    console.warn('getImagenesByPropiedad fallback (mock):', e.message);
    return [];
  }
}

// Variante raw con metadatos (id_imagen, url, prioridad, descripcion)
export async function getImagenesRawByPropiedad(idPropiedad) {
  try {
    const data = await apiFetch(`/imagenes/propiedad/${idPropiedad}`);
    if (!Array.isArray(data)) return [];
    return data.map(item => ({
      id_imagen: item.id_imagen || item.id || null,
      url: resolveImageUrl(item),
      prioridad: item.prioridad || 0,
      descripcion: item.descripcion || '',
    })).filter(img => img.url);
  } catch (e) {
    console.warn('getImagenesRawByPropiedad error:', e.message);
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

export async function deleteImagenPropiedad(idImagen) {
  return apiFetch(`/imagenes/${idImagen}`, { method: 'DELETE' });
}

export async function updatePrioridadImagen(idImagen, prioridad) {
  return apiFetch(`/imagenes/${idImagen}/prioridad`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prioridad })
  });
}

// ==== Ejemplo: consumir saludo ====
export async function getSaludo() {
  return apiFetch(`/saludo`);
}

// ==== Contratos Documentos (Generación de PDFs) ====
/**
 * Generar contrato de compraventa
 */
export async function generarContrato(contratoData) {
  try {
    return await apiFetch(`/contratos-documentos/generar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contratoData)
    });
  } catch (e) {
    throw new Error('Error al generar contrato: ' + (e.message || ''));
  }
}

/**
 * Obtener contratos de un cliente
 */
export async function getContratosByCliente(id_cliente) {
  try {
    const data = await apiFetch(`/contratos-documentos/cliente/${id_cliente}`);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('getContratosByCliente error:', e.message);
    return [];
  }
}

/**
 * Obtener todos los contratos (admin/agente)
 */
export async function getAllContratosDocumentos() {
  try {
    const data = await apiFetch(`/contratos-documentos`);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('getAllContratosDocumentos error:', e.message);
    return [];
  }
}

/**
 * Obtener contrato por ID
 */
export async function getContratoDocumento(id) {
  try {
    return await apiFetch(`/contratos-documentos/${id}`);
  } catch (e) {
    throw new Error('Error al obtener contrato: ' + (e.message || ''));
  }
}

/**
 * Construir URL de descarga de contrato
 */
export function getUrlDescargarContrato(id) {
  return `${API_BASE}/contratos-documentos/descargar/${id}`;
}

