// ./pages/agentes.jsx
import React from "react";

// Datos de ejemplo de los agentes
const agentes = [
  {
    id: 1,
    nombre: "Sebas Tique",
    correo: "juan.tiqug@email.com",
    telefono: "+57 300 123 4567",
    foto: "/images/sebas.jpg", // ahora apunta a tu archivo en /public/images
  },
  {
    id: 2,
    nombre: "Yair Peña",
    correo: "yairstevanp@gmail.com",
    telefono: "+57 3214622453",
    foto: "/images/yair.jpg",
  },
  {
    id: 3,
    nombre: "Yosman Espinosa",
    correo: "yosmansena31@gmail.com",
    telefono: "+57 320 456 7890",
    foto: "/images/yosman.jpg",
  },
];

export default function Agentes() {
  return (
    <section className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Nuestros Agentes
        </h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {agentes.map((agente) => (
            <div
              key={agente.id}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:scale-105 transform transition"
            >
              <img
                src={agente.foto}
                alt={agente.nombre}
                className="w-24 h-24 rounded-full mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                {agente.nombre}
              </h2>
              <p className="text-gray-500 mb-1">{agente.correo}</p>
              <p className="text-gray-500">{agente.telefono}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}