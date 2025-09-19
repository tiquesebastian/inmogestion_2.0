// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#1f3b8f', color: 'white', textAlign: 'center', padding: '1rem' }}>
      <p>
        &copy; 2025 InmoGestión. Todos los derechos reservados. |{' '}
        <Link to="/politica-privacidad" style={{ color: '#ffffff', textDecoration: 'underline' }}>
          Política de Privacidad
        </Link>{' '}
        |{' '}
        <Link to="/" style={{ color: '#ffffff', textDecoration: 'underline' }}>
          Volver al Inicio
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
