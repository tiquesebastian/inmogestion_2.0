import React, { useEffect, useState } from 'react';
import { getDashboard } from '../../services/api';

export default function ReportesAdmin() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Inicializar con últimos 30 días
  useEffect(() => {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);
    
    setFechaFin(hoy.toISOString().split('T')[0]);
    setFechaInicio(hace30Dias.toISOString().split('T')[0]);
  }, []);

  const cargarDatos = async () => {
    if (!fechaInicio || !fechaFin) return;
    
    setLoading(true);
    setError('');
    try {
      const dashboard = await getDashboard(fechaInicio, fechaFin);
      setData(dashboard);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard de Reportes</h2>
        
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

          {/* Funnel de Conversión */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">🎯 Funnel de Conversión</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FunnelStage
                label="Intereses"
                value={data.funnel_conversion?.intereses || 0}
                color="bg-blue-500"
                width="100%"
              />
              <FunnelStage
                label="Visitas"
                value={data.funnel_conversion?.visitas || 0}
                color="bg-yellow-500"
                width={`${data.funnel_conversion?.tasa_interes_visita || 0}%`}
                tasa={`${data.funnel_conversion?.tasa_interes_visita}%`}
              />
              <FunnelStage
                label="Contratos"
                value={data.funnel_conversion?.contratos || 0}
                color="bg-green-500"
                width={`${data.funnel_conversion?.tasa_interes_contrato || 0}%`}
                tasa={`${data.funnel_conversion?.tasa_interes_contrato}%`}
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
                  {data.top_propiedades_intereses?.map((prop) => (
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
                  ))}
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

function FunnelStage({ label, value, color, width, tasa }) {
  return (
    <div className="text-center">
      <div className="mb-2">
        <div className={`${color} text-white font-bold py-3 px-4 rounded-lg`} style={{ width }}>
          <p className="text-sm opacity-90">{label}</p>
          <p className="text-2xl">{value}</p>
        </div>
      </div>
      {tasa && <p className="text-sm text-gray-600 font-semibold">Conversión: {tasa}</p>}
    </div>
  );
}

