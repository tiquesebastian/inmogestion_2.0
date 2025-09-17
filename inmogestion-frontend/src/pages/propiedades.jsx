import { useState } from "react";
import { inmuebles } from "../assets/inmuebles";

export default function Propiedades() {
  const [tipo, setTipo] = useState("lotes");

  return (
    <section className="p-6">
      <h2 className="text-3xl font-bold text-blue-900">Propiedades</h2>

      {/* Barra de navegación secundaria */}
      <div className="flex gap-4 mt-8 mb-6 justify-center">
        <button
          className={`px-4 py-2 rounded-t-md font-semibold border-b-4 transition-colors ${
            tipo === "lotes"
              ? "border-yellow-400 text-yellow-400"
              : "border-transparent text-gray-700"
          }`}
          onClick={() => setTipo("lotes")}
        >
          Ver Lotes
        </button>

        <button
          className={`px-4 py-2 rounded-t-md font-semibold border-b-4 transition-colors ${
            tipo === "apartamentos"
              ? "border-yellow-400 text-yellow-400"
              : "border-transparent text-gray-700"
          }`}
          onClick={() => setTipo("apartamentos")}
        >
          Ver Apartamentos
        </button>

        <button
          className={`px-4 py-2 rounded-t-md font-semibold border-b-4 transition-colors ${
            tipo === "casas"
              ? "border-yellow-400 text-yellow-400"
              : "border-transparent text-gray-700"
          }`}
          onClick={() => setTipo("casas")}
        >
          Ver Casas
        </button>
      </div>

      {/* Contenido según el tipo seleccionado */}
      <div className="mt-6 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {inmuebles[tipo].map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            <img
              src={item.imagen}
              alt={item.titulo}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-blue-900 mb-2">
                {item.titulo}
              </h3>
              <p className="text-gray-700 mb-2">{item.descripcion}</p>
              <p className="text-gray-500 text-sm mb-2">
                Ubicación: {item.ubicacion}
              </p>
              <p className="text-yellow-600 font-semibold text-lg mt-auto">
                {item.precio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
