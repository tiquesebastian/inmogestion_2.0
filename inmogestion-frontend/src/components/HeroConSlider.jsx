import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const images = [
  "/images/apartamentos.jpeg",
  "/images/piscina.jpeg",
  "/images/cancha.jpeg",
  "/images/sala.jpeg",
  "/images/gym.jpeg",
  "/images/casa_azul.jpeg"
];



export default function HeroConSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

 useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

   return (
    <div className="bg-yellow-400 py-16">
      <div className="text-center text-white mb-8 px-4">
        <h1 className="text-5xl font-extrabold mb-4">
          Bienvenido a <span className="text-blue-900">InmoGestión</span>
        </h1>
        <p className="text-lg text-blue-900">
          Encuentra la propiedad de tus sueños con la ayuda de nuestros agentes expertos.
        </p>
        <div className="mt-6 space-x-4">
          <Link
            to="/propiedades"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
          >
            Ver Propiedades
          </Link>
          <Link
            to="/login"
            className="bg-white hover:bg-gray-100 text-blue-900 font-semibold px-6 py-3 rounded-lg shadow-md transition"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>

      {/* Slider debajo */}
      <div className="w-full max-w-4xl mx-auto mt-10">
        <img
  src={images[currentIndex]}
  alt={`Slide ${currentIndex + 1}`}
  className="w-full h-[300px] md:h-[350px] object-cover rounded-lg shadow-xl transition-all duration-1000"
/>
      </div>
    </div>
  );
}