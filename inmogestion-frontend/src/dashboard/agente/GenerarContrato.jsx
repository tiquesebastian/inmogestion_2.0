import React, { useState, useEffect } from 'react';
import { generarContrato, getProperties, getClientes } from '../../services/api';

export default function GenerarContrato() {
  const [loading, setLoading] = useState(false);
  const [propiedades, setPropiedades] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  
  const [formData, setFormData] = useState({
    // Selección básica
    id_propiedad: '',
    id_cliente: '',
    tipo_inmueble: 'Casa',
    
    // Datos del vendedor
    vendedor_nombre: '',
    vendedor_apellido: '',
    vendedor_tipo_documento: 'CC',
    vendedor_numero_documento: '',
    vendedor_direccion: '',
    vendedor_telefono: '',
    
    // Datos del comprador
    comprador_nombre: '',
    comprador_apellido: '',
    comprador_tipo_documento: 'CC',
    comprador_numero_documento: '',
    comprador_direccion: '',
    comprador_telefono: '',
    
    // Datos del inmueble
    inmueble_matricula: '',
    inmueble_area_m2: '',
    inmueble_direccion: '',
    inmueble_linderos: '',
    inmueble_descripcion: '',
    
    // Datos económicos
    precio_venta: '',
    forma_pago: '',
    
    // Cláusulas adicionales
    clausulas_adicionales: '',
    
    // Lugar y fecha
    lugar_firma: 'Bogotá D.C.',
    fecha_firma: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [propsData, clientsData] = await Promise.all([
        getProperties(),
        getClientes()
      ]);
      setPropiedades(propsData || []);
      setClientes(clientsData || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePropiedadChange = (e) => {
    const id_propiedad = e.target.value;
    setFormData(prev => ({ ...prev, id_propiedad }));
    
    // Auto-rellenar datos del inmueble
    const propiedad = propiedades.find(p => p.id_propiedad == id_propiedad);
    if (propiedad) {
      setFormData(prev => ({
        ...prev,
        id_propiedad,
        tipo_inmueble: propiedad.tipo_propiedad || 'Casa',
        inmueble_direccion: propiedad.direccion_formato || '',
        inmueble_area_m2: propiedad.area_m2 || '',
        precio_venta: propiedad.precio_propiedad || '',
        inmueble_descripcion: propiedad.descripcion || ''
      }));
    }
  };

  const handleClienteChange = (e) => {
    const id_cliente = e.target.value;
    setFormData(prev => ({ ...prev, id_cliente }));
    
    // Auto-rellenar datos del comprador
    const cliente = clientes.find(c => c.id_cliente == id_cliente);
    if (cliente) {
      const [nombre, ...apellidos] = (cliente.nombre_cliente || '').split(' ');
      setFormData(prev => ({
        ...prev,
        id_cliente,
        comprador_nombre: nombre || '',
        comprador_apellido: apellidos.join(' ') || '',
        comprador_tipo_documento: 'CC',
        comprador_numero_documento: '',
        comprador_direccion: cliente.direccion_cliente || '',
        comprador_telefono: cliente.telefono_cliente || ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ tipo: '', texto: '' });
    
    try {
      // Obtener id del usuario que está generando el contrato
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      const generado_por = user?.id_usuario || user?.id || null;
      
      if (!generado_por) {
        throw new Error('No se pudo identificar al usuario');
      }

      const payload = {
        ...formData,
        precio_venta: parseFloat(formData.precio_venta) || 0,
        inmueble_area_m2: parseFloat(formData.inmueble_area_m2) || null,
        generado_por
      };

      const response = await generarContrato(payload);
      
      setMensaje({
        tipo: 'success',
        texto: `¡Contrato generado exitosamente! ID: ${response.id_contrato_documento}`
      });
      
      // Limpiar formulario
      setTimeout(() => {
        setFormData({
          id_propiedad: '',
          id_cliente: '',
          tipo_inmueble: 'Casa',
          vendedor_nombre: '',
          vendedor_apellido: '',
          vendedor_tipo_documento: 'CC',
          vendedor_numero_documento: '',
          vendedor_direccion: '',
          vendedor_telefono: '',
          comprador_nombre: '',
          comprador_apellido: '',
          comprador_tipo_documento: 'CC',
          comprador_numero_documento: '',
          comprador_direccion: '',
          comprador_telefono: '',
          inmueble_matricula: '',
          inmueble_area_m2: '',
          inmueble_direccion: '',
          inmueble_linderos: '',
          inmueble_descripcion: '',
          precio_venta: '',
          forma_pago: '',
          clausulas_adicionales: '',
          lugar_firma: 'Bogotá D.C.',
          fecha_firma: new Date().toISOString().split('T')[0],
        });
      }, 2000);
      
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: error.message || 'Error al generar el contrato'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📄 Generar Contrato de Compraventa</h2>
      
      {mensaje.texto && (
        <div className={`mb-6 p-4 rounded-lg ${
          mensaje.tipo === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
          'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de Propiedad y Cliente */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">1. Seleccionar Propiedad y Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Propiedad *</label>
              <select
                name="id_propiedad"
                value={formData.id_propiedad}
                onChange={handlePropiedadChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar propiedad...</option>
                {propiedades.map(p => (
                  <option key={p.id_propiedad} value={p.id_propiedad}>
                    {p.tipo_propiedad} - {p.direccion_formato} (${new Intl.NumberFormat('es-CO').format(p.precio_propiedad)})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cliente (Comprador) *</label>
              <select
                name="id_cliente"
                value={formData.id_cliente}
                onChange={handleClienteChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar cliente...</option>
                {clientes.map(c => (
                  <option key={c.id_cliente} value={c.id_cliente}>
                    {c.nombre_cliente} - {c.correo_cliente}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Inmueble *</label>
              <select
                name="tipo_inmueble"
                value={formData.tipo_inmueble}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Lote">Lote</option>
              </select>
            </div>
          </div>
        </div>

        {/* Datos del Vendedor */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">2. Datos del Vendedor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
              <input
                type="text"
                name="vendedor_nombre"
                value={formData.vendedor_nombre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
              <input
                type="text"
                name="vendedor_apellido"
                value={formData.vendedor_apellido}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento *</label>
              <select
                name="vendedor_tipo_documento"
                value={formData.vendedor_tipo_documento}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="NIT">NIT</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número de Documento *</label>
              <input
                type="text"
                name="vendedor_numero_documento"
                value={formData.vendedor_numero_documento}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
              <input
                type="text"
                name="vendedor_direccion"
                value={formData.vendedor_direccion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
              <input
                type="tel"
                name="vendedor_telefono"
                value={formData.vendedor_telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Datos del Comprador */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">3. Datos del Comprador</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
              <input
                type="text"
                name="comprador_nombre"
                value={formData.comprador_nombre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
              <input
                type="text"
                name="comprador_apellido"
                value={formData.comprador_apellido}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento *</label>
              <select
                name="comprador_tipo_documento"
                value={formData.comprador_tipo_documento}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="NIT">NIT</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número de Documento *</label>
              <input
                type="text"
                name="comprador_numero_documento"
                value={formData.comprador_numero_documento}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
              <input
                type="text"
                name="comprador_direccion"
                value={formData.comprador_direccion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
              <input
                type="tel"
                name="comprador_telefono"
                value={formData.comprador_telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Datos del Inmueble */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">4. Datos del Inmueble</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Matrícula Inmobiliaria</label>
              <input
                type="text"
                name="inmueble_matricula"
                value={formData.inmueble_matricula}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Área (m²)</label>
              <input
                type="number"
                step="0.01"
                name="inmueble_area_m2"
                value={formData.inmueble_area_m2}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Dirección *</label>
              <input
                type="text"
                name="inmueble_direccion"
                value={formData.inmueble_direccion}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Linderos</label>
              <textarea
                name="inmueble_linderos"
                value={formData.inmueble_linderos}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Norte: ..., Sur: ..., Oriente: ..., Occidente: ..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción Adicional</label>
              <textarea
                name="inmueble_descripcion"
                value={formData.inmueble_descripcion}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Datos Económicos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">5. Datos Económicos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Precio de Venta (COP) *</label>
              <input
                type="number"
                step="0.01"
                name="precio_venta"
                value={formData.precio_venta}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pago *</label>
              <textarea
                name="forma_pago"
                value={formData.forma_pago}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ejemplo: Pago de contado al momento de la firma de la escritura pública..."
              />
            </div>
          </div>
        </div>

        {/* Cláusulas Adicionales */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">6. Información Adicional</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lugar de Firma *</label>
              <input
                type="text"
                name="lugar_firma"
                value={formData.lugar_firma}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Firma *</label>
              <input
                type="date"
                name="fecha_firma"
                value={formData.fecha_firma}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cláusulas Adicionales</label>
              <textarea
                name="clausulas_adicionales"
                value={formData.clausulas_adicionales}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Incluya aquí cualquier cláusula especial acordada entre las partes..."
              />
            </div>
          </div>
        </div>

        {/* Botón de Envío */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Generando...' : '📄 Generar Contrato'}
          </button>
        </div>
      </form>
    </div>
  );
}
