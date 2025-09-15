import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Propiedades from "./pages/Propiedades";
import Contratos from "./pages/Contratos";
import Reportes from "./pages/Reportes";
import ClientesList from "./components/clientes/ClientesList";


function App() {
  // Simulamos autenticación: luego debes leerlo de localStorage o contexto
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <Routes>
          {/* Login público */}
          <Route path="/login" element={<Login setToken={setToken} />} />

          {/* Rutas privadas */}
          {token ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/clientes/lista" element={<ClientesList />} />
              <Route path="/propiedades" element={<Propiedades />} />
              <Route path="/contratos" element={<Contratos />} />
              <Route path="/reportes" element={<Reportes />} />
            </>
          ) : (
            // Si no hay token, redirige a login
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
