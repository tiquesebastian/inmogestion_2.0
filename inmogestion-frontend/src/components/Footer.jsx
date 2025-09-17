// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#1f3b8f', color: 'white', textAlign: 'center', padding: '1rem' }}>
      <p>
        &copy; 2025 InmoGestión. Todos los derechos reservados. |{' '}
        <a href="/politica-privacidad.html" style={{ color: '#ffffff', textDecoration: 'underline' }}>
          Política de Privacidad
        </a>
      </p>
    </footer>
  );
};

export default Footer;
