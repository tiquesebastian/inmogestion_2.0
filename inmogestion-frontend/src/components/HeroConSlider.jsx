import { useState, useEffect } from "react";
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
    <div className="w-full relative overflow-hidden">
      {/* Fondo naranja full width */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-400 to-orange-500"></div>
      {/* Contenido centrado */}
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-8 py-16">
        <div className="text-center text-white mb-8 px-2 sm:px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-md">
            Bienvenido a <span className="text-blue-900">InmoGestión</span>
          </h1>
          <p className="text-base md:text-lg text-blue-900 max-w-2xl mx-auto font-medium">
            Encuentra la propiedad de tus sueños con la ayuda de nuestros agentes expertos.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              to="/propiedades"
              className="btn-primary-gradient"
            >
              Ver Propiedades
            </Link>
            <Link
              to="/login"
              className="btn-secondary-gradient"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
        {/* Slider */}
        <div className="w-full max-w-5xl mx-auto mt-6 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/30">
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-[300px] md:h-[420px] object-cover transition-all duration-1000"
          />
          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-3 w-3 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-white scale-125 shadow-md'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Ir a imagen ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}