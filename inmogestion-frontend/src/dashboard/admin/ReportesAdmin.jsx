import React, { useEffect, useState } from 'react';
import { getDashboard } from '../../services/api';

export default function ReportesAdmin() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [fromCache, setFromCache] = useState(false);

  // Inicializar con últimos 30 días
  useEffect(() => {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);
    
    setFechaFin(hoy.toISOString().split('T')[0]);
    setFechaInicio(hace30Dias.toISOString().split('T')[0]);
  }, []);

  // Permite forzar recálculo (ignorar caché) con refresh=true
  const cargarDatos = async (forceRefresh = false) => {
    if (!fechaInicio || !fechaFin) return;
    setLoading(true);
    setError('');
    try {
      const dashboard = await getDashboard(fechaInicio, fechaFin, forceRefresh);
      setData(dashboard);
      const generatedAt = dashboard?.meta?.generated_at || new Date().toISOString();
      setLastUpdated(generatedAt);
      setFromCache(Boolean(dashboard?.meta?.cache));
    } catch (e) {
      setError(e.message || 'Error cargando reportes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      cargarDatos();
    }
  }, [fechaInicio, fechaFin]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const timeAgo = (iso) => {
    if (!iso) return '';
    const now = Date.now();
    const ts = new Date(iso).getTime();
    const diff = Math.max(0, Math.floor((now - ts) / 1000));
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <div className="space-y-6">
  <div className="flex justify-between items-center gap-4 flex-wrap">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard de Reportes</h2>
        {/* Indicador de caché / última actualización */}
        {lastUpdated && (
          <div className="flex items-center gap-2 text-sm">
            <span className={`px-2 py-1 rounded-full border ${fromCache ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
              {fromCache ? 'En caché' : 'Actualizado'}
            </span>
            <span className="text-gray-500">hace {timeAgo(lastUpdated)}</span>
            <button
              className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-200 transition"
              title="Actualizar ahora (ignorar caché)"
              onClick={() => cargarDatos(true)}
              disabled={loading}
            >
              Actualizar ahora
            </button>
          </div>
        )}

        {/* Filtros de fecha */}
        <div className="flex gap-3 items-center">
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
          <span className="text-gray-600">hasta</span>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando reportes...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 font-semibold">⚠️ Error</p>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={cargarDatos}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      ) : data ? (
        <>
          {/* KPIs Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPI
              label="Total Ventas"
              value={formatCurrency(data.resumen_ventas?.valor_total || 0)}
              subtitle={`${data.resumen_ventas?.total_contratos || 0} contratos`}
              color="green"
              icon="💰"
            />
            <KPI
              label="Promedio Venta"
              value={formatCurrency(data.resumen_ventas?.promedio_venta || 0)}
              subtitle="Por contrato"
              color="blue"
              icon="📊"
            />
            <KPI
              label="Clientes Nuevos"
              value={data.clientes_nuevos?.total_nuevos || 0}
              subtitle="En el periodo"
              color="purple"
              icon="👥"
            />
            <KPI
              label="Ciclo Promedio"
              value={`${Math.round(data.tiempo_ciclo_venta?.dias_promedio || 0)} días`}
              subtitle="Contrato → Venta"
              color="orange"
              icon="⏱️"
            />
          </div>

          {/* Funnel de Conversión (rediseñado) */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-5 text-gray-800 flex items-center gap-2">
              🎯 Funnel de Conversión
              <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                Periodo activo
              </span>
            </h3>
            <div className="space-y-4">
              <FunnelRow
                label="Intereses"
                value={data.funnel_conversion?.intereses || 0}
                color="blue"
                base
              />
              <FunnelRow
                label="Visitas"
                value={data.funnel_conversion?.visitas || 0}
                color="yellow"
                porcentaje={safeRate(data.funnel_conversion?.intereses, data.funnel_conversion?.visitas)}
              />
              <FunnelRow
                label="Contratos"
                value={data.funnel_conversion?.contratos || 0}
                color="green"
                porcentaje={safeRate(data.funnel_conversion?.visitas, data.funnel_conversion?.contratos)}
              />
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <InfoBadge
                label="Visitas / Intereses"
                value={formatPercent(safeRate(data.funnel_conversion?.intereses, data.funnel_conversion?.visitas))}
                color="yellow"
              />
              <InfoBadge
                label="Contratos / Visitas"
                value={formatPercent(safeRate(data.funnel_conversion?.visitas, data.funnel_conversion?.contratos))}
                color="green"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Agentes */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">🏆 Top Agentes</h3>
              <div className="space-y-3">
                {data.ventas_por_agente?.slice(0, 5).map((agente, idx) => (
                  <div key={agente.id_usuario} className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-300">#{idx + 1}</span>
                      <div>
                        <p className="font-semibold">{agente.nombre} {agente.apellido}</p>
                        <p className="text-sm text-gray-600">{agente.total_contratos} contratos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(agente.valor_total)}</p>
                      <p className="text-xs text-gray-500">Promedio: {formatCurrency(agente.promedio_venta)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ventas por Localidad */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">📍 Ventas por Localidad</h3>
              <div className="space-y-3">
                {data.ventas_por_localidad?.slice(0, 5).map((loc) => (
                  <div key={loc.id_localidad} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-semibold">{loc.nombre_localidad}</p>
                      <p className="text-sm text-gray-600">{loc.total_contratos} ventas</p>
                    </div>
                    <p className="font-bold text-blue-600">{formatCurrency(loc.valor_total)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Propiedades por Estado */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">🏠 Distribución por Estado</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.propiedades_por_estado?.map((estado) => (
                <div key={estado.estado_propiedad} className="border rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">{estado.estado_propiedad}</p>
                  <p className="text-2xl font-bold text-gray-800">{estado.total}</p>
                  <p className="text-xs text-gray-500">Promedio: {formatCurrency(estado.precio_promedio)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Propiedades con más Interés */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">⭐ Propiedades Más Interesadas</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Propiedad</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Intereses</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  </tr>
                </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(data.top_propiedades_intereses) && data.top_propiedades_intereses.length > 0 ? (
                      data.top_propiedades_intereses.map((prop) => (
                        <tr key={prop.id_propiedad} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-sm">{prop.tipo_propiedad}</p>
                            <p className="text-xs text-gray-500">{prop.direccion_formato}</p>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <p>{prop.nombre_localidad}</p>
                            <p className="text-xs text-gray-500">{prop.nombre_barrio}</p>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(prop.precio_propiedad)}</td>
                          <td className="px-4 py-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                              {prop.total_intereses} ({prop.clientes_unicos} únicos)
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              prop.estado_propiedad === 'Disponible' ? 'bg-green-100 text-green-800' :
                              prop.estado_propiedad === 'Reservada' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {prop.estado_propiedad}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                          No hay propiedades con interés en este periodo
                        </td>
                      </tr>
                    )}
                  </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No hay datos disponibles para el periodo seleccionado</p>
        </div>
      )}
    </div>
  );
}

function KPI({ label, value, subtitle, color, icon }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
  };
  
  return (
    <div className={`rounded-lg border-2 p-5 ${colors[color] || colors.blue}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium opacity-75">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-xs opacity-60 mt-1">{subtitle}</p>}
    </div>
  );
}

function safeRate(base, result) {
  const b = Number(base) || 0;
  const r = Number(result) || 0;
  if (b <= 0) return 0;
  const pct = (r / b) * 100;
  return Math.min(Math.max(pct, 0), 100); // clamp 0-100
}

function formatPercent(val) {
  return `${val.toFixed(1)}%`;
}

function FunnelRow({ label, value, porcentaje, color, base }) {
  const colors = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500'
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-sm font-semibold text-gray-800">{value}</span>
      </div>
      <div className="h-6 w-full bg-gray-100 rounded overflow-hidden relative">
        {base ? (
          <div className={`${colors[color]} h-full w-full flex items-center px-2 text-white text-xs font-semibold`}>Base</div>
        ) : (
          <div className={`${colors[color]} h-full transition-all duration-500`} style={{ width: `${porcentaje}%` }}>
            <div className="h-full flex items-center px-2 text-white text-xs font-semibold">
              {formatPercent(porcentaje)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBadge({ label, value, color }) {
  const colors = {
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200'
  };
  return (
    <div className={`rounded-lg border px-4 py-3 flex items-center justify-between ${colors[color]}`}> 
      <span className="text-xs font-medium">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

