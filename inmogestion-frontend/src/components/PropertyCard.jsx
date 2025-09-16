// src/components/PropertyCard.jsx
import { useState } from "react";

function PropertyCard({ property }) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("¡Tu interés ha sido registrado!");
    setOpen(false);
  };

  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <img src={property.image} alt={property.title} className="w-full h-40 object-cover rounded" />
      <h3 className="text-lg font-bold mt-2">{property.title}</h3>
      <p className="text-gray-600">{property.city}</p>
      <p className="text-blue-600 font-semibold">${property.price}</p>
      <button
        onClick={() => setOpen(true)}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Ver más
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{property.title}</h2>
            <p>{property.description}</p>
            <p className="text-blue-600 font-semibold my-2">Precio: ${property.price}</p>

            {/* Formulario de interés */}
            <form onSubmit={handleSubmit} className="space-y-3 mt-4">
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="email"
                placeholder="Tu correo"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="tel"
                placeholder="Tu teléfono"
                className="w-full border p-2 rounded"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Enviar interés
              </button>
            </form>

            <button
              onClick={() => setOpen(false)}
              className="mt-3 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyCard;
