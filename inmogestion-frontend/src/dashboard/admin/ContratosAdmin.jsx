import React, { useState, useEffect } from 'react';
import { getAllContratosDocumentos } from '../../services/api';

export default function ContratosAdmin() {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    tipo_inmueble: '',
    estado: '',
    busqueda: ''
  });

  useEffect(() => {
    cargarContratos();
  }, []);

  const cargarContratos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllContratosDocumentos();
      setContratos(data);
    } catch (err) {
      setError('Error al cargar contratos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const contratosFiltrados = contratos.filter(c => {
    const matchTipo = !filtros.tipo_inmueble || c.tipo_inmueble === filtros.tipo_inmueble;
    const matchEstado = !filtros.estado || c.estado_documento === filtros.estado;
    const matchBusqueda = !filtros.busqueda || 
      c.comprador_nombre?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      c.comprador_apellido?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      c.inmueble_direccion?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      c.id_contrato_documento?.toString().includes(filtros.busqueda);
    
    return matchTipo && matchEstado && matchBusqueda;
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatCurrencyCompact = (value) => {
    if (value >= 1000000000) {
      return `$ ${(value / 1000000000).toFixed(1)} mil M`;
    } else if (value >= 1000000) {
      return `$ ${(value / 1000000).toFixed(1)} M`;
    } else {
      return formatCurrency(value);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(fecha));
  };

  const descargarContrato = async (contratoId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/contratos-documentos/descargar/${contratoId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`❌ Error: ${error.message || 'No se pudo descargar el contrato'}`);
        return;
      }

      // Convertir a blob y descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contrato_${contratoId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar:', error);
      alert('❌ Error al descargar el contrato');
    }
  };

  // Estadísticas
  const stats = {
    total: contratos.length,
    generados: contratos.filter(c => c.estado_documento === 'Generado').length,
    firmados: contratos.filter(c => c.estado_documento === 'Firmado').length,
    casas: contratos.filter(c => c.tipo_inmueble === 'Casa').length,
    apartamentos: contratos.filter(c => c.tipo_inmueble === 'Apartamento').length,
    lotes: contratos.filter(c => c.tipo_inmueble === 'Lote').length,
    valorTotal: contratos.reduce((sum, c) => sum + (parseFloat(c.precio_venta) || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">📄 Reporte de Contratos</h2>
        <button
          onClick={cargarContratos}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          🔄 Actualizar
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contratos</p>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="text-4xl">📄</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Generados</p>
              <p className="text-3xl font-bold text-blue-600">{stats.generados}</p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Firmados</p>
              <p className="text-3xl font-bold text-green-600">{stats.firmados}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrencyCompact(stats.valorTotal)}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      </div>

      {/* Distribución por tipo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Distribución por Tipo de Inmueble</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🏠</div>
            <p className="text-2xl font-bold text-gray-800">{stats.casas}</p>
            <p className="text-sm text-gray-600">Casas</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🏢</div>
            <p className="text-2xl font-bold text-gray-800">{stats.apartamentos}</p>
            <p className="text-sm text-gray-600">Apartamentos</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">📍</div>
            <p className="text-2xl font-bold text-gray-800">{stats.lotes}</p>
            <p className="text-sm text-gray-600">Lotes</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Inmueble</label>
            <select
              value={filtros.tipo_inmueble}
              onChange={(e) => setFiltros(prev => ({ ...prev, tipo_inmueble: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Lote">Lote</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="Generado">Generado</option>
              <option value="Firmado">Firmado</option>
              <option value="Anulado">Anulado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              value={filtros.busqueda}
              onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
              placeholder="ID, cliente, dirección..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {(filtros.tipo_inmueble || filtros.estado || filtros.busqueda) && (
          <button
            onClick={() => setFiltros({ tipo_inmueble: '', estado: '', busqueda: '' })}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Lista de contratos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">
            Listado de Contratos ({contratosFiltrados.length})
          </h3>
        </div>

        {contratosFiltrados.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg">No hay contratos que coincidan con los filtros</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comprador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propiedad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Firma</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generado por</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contratosFiltrados.map((contrato) => (
                  <tr key={contrato.id_contrato_documento} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{contrato.id_contrato_documento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="flex items-center gap-2">
                        {contrato.tipo_inmueble === 'Casa' ? '🏠' :
                         contrato.tipo_inmueble === 'Apartamento' ? '🏢' : '📍'}
                        {contrato.tipo_inmueble}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {contrato.comprador_nombre} {contrato.comprador_apellido}
                      <br />
                      <span className="text-xs text-gray-500">{contrato.comprador_tipo_documento}: {contrato.comprador_numero_documento}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {contrato.inmueble_direccion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(contrato.precio_venta)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFecha(contrato.fecha_firma)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        contrato.estado_documento === 'Generado' ? 'bg-blue-100 text-blue-800' :
                        contrato.estado_documento === 'Firmado' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {contrato.estado_documento}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {contrato.generado_por_nombre} {contrato.generado_por_apellido}
                      <br />
                      <span className="text-xs text-gray-400">{formatFecha(contrato.fecha_generacion)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {contrato.archivo_pdf ? (
                        <button
                          onClick={() => descargarContrato(contrato.id_contrato_documento)}
                          className="text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Descargar
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">Sin PDF</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
