import { useState } from "react";  // IMPORTANTE: importar useState
import { Link } from "react-router-dom";
import HeroConSlider from "../components/HeroConSlider";

export default function Inicio() {
  const [showForm, setShowForm] = useState(false);  // DECLARA EL ESTADO

  return (
    <section className="bg-gray-50">
      <HeroConSlider />

      {/* Sección de ventajas */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8 text-center">
        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="text-xl font-bold text-blue-900">Propiedades verificadas</h3>
          <p className="mt-2 text-gray-600">Publicaciones reales con documentación en regla.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border">
          <h3 className="text-xl font-bold text-blue-900">..</h3>
          <p className="mt-2 text-gray-600"></p>
        </div>

     <div
  className="bg-white p-6 rounded-xl shadow-lg border cursor-pointer"
  style={{ minHeight: "160px" }}
  onClick={() => setShowForm(!showForm)}
>
  <h3 className="text-xl font-bold text-blue-900 mb-2">Búsqueda rápida</h3>
  <p className="mt-2 text-gray-600 mb-4">
    Encuentra propiedades por zona, precio o tipo en segundos.
  </p>

  {showForm && (
    <form
      className="space-y-4"
      onClick={(e) => e.stopPropagation()}  // Aquí evitamos que el click salga del form
    >
      <input
        type="text"
        placeholder="Zona o ciudad"
        className="w-full border border-gray-300 rounded px-4 py-2"
      />
      <select className="w-full border border-gray-300 rounded px-4 py-2">
        <option value="">Tipo de propiedad</option>
        <option value="apartamento">Apartamento</option>
        <option value="casa">Casa</option>
        <option value="oficina">Oficina</option>
      </select>
      <input
        type="number"
        placeholder="Precio máximo"
        className="w-full border border-gray-300 rounded px-4 py-2"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Buscar
      </button>
    </form>
  )}
</div>

      </div>

      {/* CTA final */}
      <div className="bg-blue-900 text-white py-16 text-center">
        <h2 className="text-3xl font-bold">¿Listo para encontrar tu nuevo hogar?</h2>
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
