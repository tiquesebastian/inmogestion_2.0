// src/components/Navbar.jsx
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold">
        InmoGestión
      </Link>

      {/* Menú */}
      <div className="space-x-6">
        <Link
          to="/"
          className="hover:text-gray-200 transition-colors duration-200"
        >
          Inicio
        </Link>
        <Link
          to="/login"
          className="hover:text-gray-200 transition-colors duration-200"
        >
          Login
        </Link>
        <Link
          to="/admin"
          className="hover:text-gray-200 transition-colors duration-200"
        >
          Admin
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
