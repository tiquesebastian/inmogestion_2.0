import { useState, useEffect } from 'react';

export default function DocumentosCliente() {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const response = await fetch('/api/clientes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const cargarDocumentos = async (clienteId) => {
    setCargando(true);
    try {
      const response = await fetch(`/api/documentos-clientes/cliente/${clienteId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setDocumentos(data);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleClienteChange = (clienteId) => {
    setClienteSeleccionado(clienteId);
    if (clienteId) {
      cargarDocumentos(clienteId);
    } else {
      setDocumentos([]);
    }
  };

  const descargarDocumento = (id, nombreArchivo) => {
    const token = localStorage.getItem('token');
    window.open(`/api/documentos-clientes/descargar/${id}?token=${token}`, '_blank');
  };

  const eliminarDocumento = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este documento?')) return;

    try {
      const response = await fetch(`/api/documentos-clientes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('✅ Documento eliminado');
        cargarDocumentos(clienteSeleccionado);
      } else {
        alert('❌ Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al eliminar');
    }
  };

  const getTipoDocumentoLabel = (tipo) => {
    const labels = {
      'cedula': '🆔 Cédula de Identidad',
      'comprobante_ingresos': '💵 Comprobante de Ingresos',
      'comprobante_domicilio': '🏠 Comprobante de Domicilio',
      'escrituras': '📜 Escrituras',
      'carta_autorizacion': '✍️ Carta de Autorización',
      'otro': '📄 Otro'
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📁 Documentos de Clientes</h1>

      {/* Selector de cliente */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Selecciona un Cliente
        </label>
        <select
          value={clienteSeleccionado}
          onChange={(e) => handleClienteChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Selecciona --</option>
          {clientes.map(cliente => (
            <option key={cliente.id_cliente} value={cliente.id_cliente}>
              {cliente.nombre_cliente} {cliente.apellido_cliente} - {cliente.correo_cliente}
            </option>
          ))}
        </select>
      </div>

      {/* Listado de documentos */}
      {cargando && (
        <div className="text-center py-12">
          <p className="text-gray-600">⏳ Cargando documentos...</p>
        </div>
      )}

      {!cargando && clienteSeleccionado && documentos.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">⚠️ Este cliente no tiene documentos cargados</p>
        </div>
      )}

      {!cargando && documentos.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Archivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subido por
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documentos.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {getTipoDocumentoLabel(doc.tipo_documento)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{doc.nombre_archivo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{doc.descripcion || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{doc.subido_por_nombre}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {new Date(doc.fecha_subida).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => descargarDocumento(doc.id, doc.nombre_archivo)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        ⬇️ Descargar
                      </button>
                      <button
                        onClick={() => eliminarDocumento(doc.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
