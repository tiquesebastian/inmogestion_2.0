import React from 'react';
import marcaAgua from "../assets/logo.png";

export default function Contacto() {
  return (
    <section className="p-6 relative bg-white overflow-hidden">
      {/* Marca de agua */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-20"
        style={{ backgroundImage: `url(${marcaAgua})` }}
      ></div>

      {/* Contenido encima */}
     <div className="relative z-10 max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-4">Contacto</h2>
        <p className="text-lg text-gray-700 mb-6">
          Déjanos tu mensaje y te responderemos pronto.
        </p>
        <a
  href="https://wa.me/573214622453?text=Hola,%20quiero%20más%20información%20sobre%20una%20propiedad"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-40 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-4 rounded-full shadow-xl flex items-center gap-2 transition-transform hover:scale-105 z-50"
>
  {/* Ícono de WhatsApp */}
  <svg
    className="w-6 h-6"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M20.52 3.48a11.98 11.98 0 00-16.96 0A11.98 11.98 0 002 12c0 2.14.56 4.21 1.61 6.05L2 22l4.11-1.6A11.95 11.95 0 0012 24c3.2 0 6.21-1.24 8.48-3.52A11.98 11.98 0 0024 12c0-3.2-1.24-6.21-3.48-8.52zM12 21.5c-2.1 0-4.17-.55-6-1.6l-.43-.25-2.42.94.93-2.43-.25-.43A9.94 9.94 0 012.5 12c0-5.23 4.27-9.5 9.5-9.5S21.5 6.77 21.5 12 17.23 21.5 12 21.5zm4.2-7.57c-.23-.12-1.35-.67-1.56-.75-.21-.08-.37-.12-.52.12s-.6.75-.74.9c-.13.15-.27.17-.5.06s-1-.37-1.9-1.18c-.7-.62-1.18-1.37-1.32-1.6-.13-.23-.01-.35.1-.46.1-.1.23-.27.35-.4.12-.13.16-.23.24-.39.08-.15.04-.3-.02-.42-.07-.12-.52-1.25-.72-1.7-.19-.46-.39-.4-.53-.41l-.45-.01c-.15 0-.4.05-.6.26-.2.2-.8.78-.8 1.9s.82 2.2.94 2.35c.12.15 1.62 2.48 3.93 3.48.55.24.98.38 1.31.49.55.17 1.05.15 1.45.09.44-.07 1.35-.55 1.54-1.09.2-.53.2-.98.14-1.08-.06-.11-.2-.17-.42-.29z" />
  </svg>

  Contactar por WhatsApp
</a>


        
      </div>
    </section>
  );
}
