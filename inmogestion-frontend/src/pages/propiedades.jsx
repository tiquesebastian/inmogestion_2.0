import { useState } from "react";
import { inmuebles } from "../assets/inmuebles";

export default function Propiedades() {
  const [tipo, setTipo] = useState("lotes");

  return (
    <section className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-900 mb-6">Propiedades</h2>

      {/* Botones filtro */}
      <div className="flex gap-4 justify-center mb-8">
        {["lotes", "apartamentos", "casas"].map((t) => (
          <button
            key={t}
            className={`px-6 py-2 rounded-t-md font-semibold border-b-4 transition-colors ${
              tipo === t
                ? "border-yellow-400 text-yellow-400"
                : "border-transparent text-gray-700 hover:text-yellow-400"
            }`}
            onClick={() => setTipo(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tarjetas */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {inmuebles[tipo].map(({ id, titulo, descripcion, ubicacion, precio, imagen }) => (
          <div key={id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <img
              src={imagen}
              alt={titulo}
              className="h-48 w-full object-cover"
              onError={(e) => {
                // Si la imagen falla (404 o URL inválida), usamos un placeholder fiable
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://via.placeholder.com/800x480?text=Imagen+no+disponible";
              }}
            />
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-blue-900 mb-2">{titulo}</h3>
              <p className="text-gray-700 mb-2 flex-grow">{descripcion}</p>
              <p className="text-gray-500 text-sm mb-2">Ubicación: {ubicacion}</p>
              <p className="text-yellow-600 font-semibold text-lg">{precio}</p>
              {/* Botones */}
              <div className="mt-4 flex gap-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">
                  Ver Detalles
                </button>
                <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 rounded-md transition">
                  Comprar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
