import React, { useState, useEffect, useContext } from 'react';
import { createProperty, getLocalidades, getBarriosByLocalidad, uploadImagenPropiedad } from '../../services/api';
import AuthContext from '../../context/AuthContext';

export default function RegistrarPropiedad() {
  const { user } = useContext(AuthContext);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    tipo_propiedad: 'Casa',
    direccion_formato: '',
    precio_propiedad: '',
    area_m2: '',
    num_habitaciones: '',
    num_banos: '',
    descripcion: '',
    estado_propiedad: 'Disponible',
    id_barrio: '',
    id_usuario: user?.id || '',
  });

  // Estados para localidades y barrios
  const [localidades, setLocalidades] = useState([]);
  const [barrios, setBarrios] = useState([]);
  const [selectedLocalidad, setSelectedLocalidad] = useState('');

  // Estados para imágenes
  const [imagenes, setImagenes] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Cargar localidades al montar
  useEffect(() => {
    async function load() {
      try {
        const data = await getLocalidades();
        setLocalidades(data);
      } catch (e) {
        console.error('Error cargando localidades:', e);
      }
    }
    load();
  }, []);

  // Cargar barrios cuando cambia la localidad
  useEffect(() => {
    if (!selectedLocalidad) {
      setBarrios([]);
      return;
    }
    async function load() {
      try {
        const data = await getBarriosByLocalidad(selectedLocalidad);
        setBarrios(data);
      } catch (e) {
        console.error('Error cargando barrios:', e);
      }
    }
    load();
  }, [selectedLocalidad]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocalidadChange = (e) => {
    setSelectedLocalidad(e.target.value);
    setFormData(prev => ({ ...prev, id_barrio: '' })); // Reset barrio
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const MAX = 10;
    let nuevas = [...imagenes, ...files];
    if (nuevas.length > MAX) {
      // Cortar y avisar
      nuevas = nuevas.slice(0, MAX);
      setError(`Máximo permitido: ${MAX} imágenes. Se ignoraron las adicionales.`);
    } else {
      setError('');
    }
    setImagenes(nuevas);
    const previews = nuevas.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const removeImage = (index) => {
    const newImages = imagenes.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setImagenes(newImages);
    setImagePreview(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!formData.direccion_formato || !formData.precio_propiedad || !formData.area_m2 || !formData.num_habitaciones || !formData.num_banos || !formData.id_barrio) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      // Preparar payload según estructura de la BD
      const payload = {
        tipo_propiedad: formData.tipo_propiedad,
        direccion_formato: formData.direccion_formato,
        precio_propiedad: parseFloat(formData.precio_propiedad),
        area_m2: parseFloat(formData.area_m2),
        num_habitaciones: parseInt(formData.num_habitaciones),
        num_banos: parseInt(formData.num_banos),
        descripcion: formData.descripcion || null,
        estado_propiedad: formData.estado_propiedad,
        id_barrio: parseInt(formData.id_barrio),
        id_usuario: parseInt(formData.id_usuario),
      };

      const result = await createProperty(payload);
      
      // Si hay imágenes, subirlas
      if (imagenes.length > 0 && result.id_propiedad) {
        try {
          for (let i = 0; i < imagenes.length; i++) {
            await uploadImagenPropiedad(result.id_propiedad, imagenes[i], i, `Imagen ${i + 1}`);
          }
          setSuccess('✅ Propiedad e imágenes registradas exitosamente');
        } catch (imgError) {
          setSuccess('✅ Propiedad registrada, pero hubo un error al subir algunas imágenes');
          console.error('Error subiendo imágenes:', imgError);
        }
      } else {
        setSuccess('✅ Propiedad registrada exitosamente');
      }
      
      // Limpiar formulario
      setFormData({
        tipo_propiedad: 'Casa',
        direccion_formato: '',
        precio_propiedad: '',
        area_m2: '',
        num_habitaciones: '',
        num_banos: '',
        descripcion: '',
        estado_propiedad: 'Disponible',
        id_barrio: '',
        id_usuario: user?.id || '',
      });
      setSelectedLocalidad('');
      setImagenes([]);
      setImagePreview([]);
      
    } catch (err) {
      setError('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-6 text-blue-900">Registrar Nueva Propiedad</h2>
      
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipo de Propiedad */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Tipo de Propiedad <span className="text-red-500">*</span>
            </label>
            <select
              name="tipo_propiedad"
              value={formData.tipo_propiedad}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Lote">Lote</option>
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Estado <span className="text-red-500">*</span>
            </label>
            <select
              name="estado_propiedad"
              value={formData.estado_propiedad}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="Disponible">Disponible</option>
              <option value="Reservada">Reservada</option>
              <option value="Vendida">Vendida</option>
            </select>
          </div>
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Dirección <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="direccion_formato"
            value={formData.direccion_formato}
            onChange={handleChange}
            placeholder="Ej: Cra 45 #23-10"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Localidad */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Localidad <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedLocalidad}
              onChange={handleLocalidadChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Seleccione localidad</option>
              {localidades.map(loc => (
                <option key={loc.id_localidad} value={loc.id_localidad}>
                  {loc.nombre_localidad}
                </option>
              ))}
            </select>
          </div>

          {/* Barrio */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Barrio <span className="text-red-500">*</span>
            </label>
            <select
              name="id_barrio"
              value={formData.id_barrio}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              disabled={!selectedLocalidad}
            >
              <option value="">
                {selectedLocalidad ? 'Seleccione barrio' : 'Primero seleccione localidad'}
              </option>
              {barrios.map(barrio => (
                <option key={barrio.id_barrio} value={barrio.id_barrio}>
                  {barrio.nombre_barrio}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Precio */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Precio (COP) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="precio_propiedad"
              value={formData.precio_propiedad}
              onChange={handleChange}
              placeholder="Ej: 350000000"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Área */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Área (m²) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="area_m2"
              value={formData.area_m2}
              onChange={handleChange}
              placeholder="Ej: 120.50"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Habitaciones */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Número de Habitaciones <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="num_habitaciones"
              value={formData.num_habitaciones}
              onChange={handleChange}
              placeholder="Ej: 3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              min="0"
              step="1"
            />
          </div>

          {/* Baños */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Número de Baños <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="num_banos"
              value={formData.num_banos}
              onChange={handleChange}
              placeholder="Ej: 2"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              min="0"
              step="1"
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción detallada de la propiedad..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows="4"
          />
        </div>

        {/* Imágenes */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Imágenes de la Propiedad
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Puedes seleccionar múltiples imágenes. La primera será la imagen principal.
          </p>
          
          {/* Preview de imágenes */}
          {imagePreview.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreview.map((preview, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={preview} 
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Principal
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Registrar Propiedad'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setFormData({
                tipo_propiedad: 'Casa',
                direccion_formato: '',
                precio_propiedad: '',
                area_m2: '',
                num_habitaciones: '',
                num_banos: '',
                descripcion: '',
                estado_propiedad: 'Disponible',
                id_barrio: '',
                id_usuario: user?.id || '',
              });
              setSelectedLocalidad('');
              setError('');
              setSuccess('');
            }}
            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
