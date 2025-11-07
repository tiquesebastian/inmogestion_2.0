/**
 * Componente Footer
 * Pie de página de la aplicación con enlaces legales y de navegación
 * Incluye copyright, política de privacidad y vínculo al inicio
 */
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white text-center py-6 mt-auto shadow-inner">
      <div className="max-w-7xl mx-auto px-4">
        {/* Logo en footer */}
        <img 
          src="/logo.png" 
          alt="Grupo Inmobiliario Cortés" 
          className="h-16 w-auto mx-auto mb-4 opacity-90"
        />
        
        {/* Información de copyright y enlaces legales */}
        <p className="text-sm md:text-base font-semibold mb-1">
          Grupo Inmobiliario Cortés
        </p>
        <p className="text-xs md:text-sm text-gray-300 mb-1">
          Powered by <span className="font-semibold text-yellow-300">InmoGestión</span>
        </p>
        <p className="text-xs text-gray-400">
          © 2025 InmoGestión. Todos los derechos reservados.
        </p>
        
        {/* Enlaces de footer */}
        <div className="flex justify-center gap-4 mt-3 text-sm">
          <Link 
            to="/politica-privacidad" 
            className="text-yellow-300 hover:text-yellow-400 transition underline"
          >
            Política de Privacidad
          </Link>
          
          <span className="text-gray-400">|</span>
          
          <Link 
            to="/" 
            className="text-yellow-300 hover:text-yellow-400 transition underline"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
