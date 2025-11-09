import React, { useState, useEffect, useContext } from 'react';
import { getContratosByCliente, getUrlDescargarContrato } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function MisContratos() {
  const { user } = useContext(AuthContext);
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id_cliente || user?.id) {
      cargarContratos();
    }
  }, [user]);

  const cargarContratos = async () => {
    setLoading(true);
    setError('');
    try {
      const id_cliente = user?.id_cliente || user?.id;
      const data = await getContratosByCliente(id_cliente);
      setContratos(data);
    } catch (err) {
      setError('Error al cargar contratos');
      console.error(err);
    } finally {
      setLoading(false);
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">📄 Mis Contratos</h2>
        <p className="text-gray-600 mt-2">
          Aquí puedes ver y descargar todos los contratos generados a tu nombre
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {contratos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No tienes contratos aún
          </h3>
          <p className="text-gray-500">
            Cuando se genere un contrato a tu nombre, aparecerá aquí
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contratos.map((contrato) => (
            <div
              key={contrato.id_contrato_documento}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">
                      {contrato.tipo_inmueble === 'Casa' ? '🏠' : 
                       contrato.tipo_inmueble === 'Apartamento' ? '🏢' : '📍'}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Contrato de {contrato.tipo_inmueble}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ID: {contrato.id_contrato_documento}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Propiedad:</strong> {contrato.propiedad_direccion || contrato.inmueble_direccion}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Precio:</strong> {formatCurrency(contrato.precio_venta)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Fecha de firma:</strong> {formatFecha(contrato.fecha_firma)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Generado:</strong> {formatFecha(contrato.fecha_generacion)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Vendedor:</strong> {contrato.vendedor_nombre} {contrato.vendedor_apellido}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Comprador:</strong> {contrato.comprador_nombre} {contrato.comprador_apellido}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      contrato.estado_documento === 'Generado' ? 'bg-blue-100 text-blue-800' :
                      contrato.estado_documento === 'Firmado' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {contrato.estado_documento}
                    </span>
                    {contrato.generado_por_nombre && (
                      <span className="text-xs text-gray-500">
                        Generado por: {contrato.generado_por_nombre} {contrato.generado_por_apellido}
                      </span>
                    )}
                  </div>
                </div>

                <div className="ml-4">
                  {contrato.archivo_pdf ? (
                    <a
                      href={getUrlDescargarContrato(contrato.id_contrato_documento)}
                      download
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Descargar PDF
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500 italic">
                      PDF no disponible
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
