import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroConSlider from "../components/HeroConSlider";

export default function Inicio() {
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState({
    localidad: '',
    tipo: '',
    precioMax: '',
    habitaciones: '',
    banos: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Construir query string con los filtros
    const params = new URLSearchParams();
    if (searchFilters.localidad) params.append('localidad', searchFilters.localidad);
    if (searchFilters.tipo) params.append('tipo', searchFilters.tipo);
    if (searchFilters.precioMax) params.append('precioMax', searchFilters.precioMax);
    if (searchFilters.habitaciones) params.append('habitaciones', searchFilters.habitaciones);
    if (searchFilters.banos) params.append('banos', searchFilters.banos);
    
    // Redirigir a propiedades con los filtros
    navigate(`/propiedades?${params.toString()}`);
  };

  return (
    <section className="bg-gray-50">
      <HeroConSlider />

      {/* Búsqueda rápida centrada */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-blue-100">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-blue-900 mb-2">🔍 Búsqueda Rápida</h3>
            <p className="text-gray-600 text-lg">Encuentra tu propiedad ideal en segundos</p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            {/* Fila 1: Localidad, Tipo, Habitaciones, Baños */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Localidad */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📍 Zona o Localidad
                </label>
                <input
                  type="text"
                  name="localidad"
                  value={searchFilters.localidad}
                  onChange={handleInputChange}
                  placeholder="Ej: Suba, Chapinero..."
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🏠 Tipo de Propiedad
                </label>
                <select 
                  name="tipo"
                  value={searchFilters.tipo}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Todos los tipos</option>
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Lote">Lote</option>
                </select>
              </div>

              {/* Habitaciones */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🛏️ Habitaciones mínimas
                </label>
                <input
                  type="number"
                  name="habitaciones"
                  value={searchFilters.habitaciones}
                  onChange={handleInputChange}
                  placeholder="Ej: 3"
                  min="0"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Baños */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🚿 Baños mínimos
                </label>
                <input
                  type="number"
                  name="banos"
                  value={searchFilters.banos}
                  onChange={handleInputChange}
                  placeholder="Ej: 2"
                  min="0"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Fila 2: Precio y Botón de búsqueda */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Precio máximo */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💰 Precio Máximo (COP)
                </label>
                <input
                  type="number"
                  name="precioMax"
                  value={searchFilters.precioMax}
                  onChange={handleInputChange}
                  placeholder="Ej: 500000000"
                  min="0"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Botón de búsqueda */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Buscar Propiedades
              </button>
            </div>

            {/* Link directo */}
            <div className="text-center pt-2">
              <Link 
                to="/propiedades" 
                className="text-blue-600 hover:text-blue-800 font-semibold underline"
              >
                Ver todas las propiedades disponibles →
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* CTA final */}
      <div className="bg-blue-900 text-white py-16 text-center">
        <h2 className="text-3xl font-bold">¿quieres ser parte del equipo?</h2>
        <Link
          to="/registro"
          className="mt-6 inline-block bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-6 py-3 rounded-lg shadow-md transition"
        >
          Registrarme Ahora
        </Link>
      </div>
    </section>
  );
}
