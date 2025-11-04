

🧱 Nueva estructura propuesta

Te dejo una propuesta organizada para el proyecto inmogestion-frontend:

inmogestion-frontend/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ProtectedRoute.jsx   ← protección de rutas privadas
│   │
│   ├── pages/
│   │   ├── Home.jsx             ← Página pública
│   │   ├── Login.jsx
│   │   ├── Registro.jsx
│   │   ├── Propiedades.jsx
│   │   ├── Agentes.jsx
│   │   ├── Contacto.jsx
│   │   └── NotFound.jsx
│   │
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── PropiedadesAdmin.jsx
│   │   │   ├── UsuariosAdmin.jsx
│   │   │   └── ReportesAdmin.jsx
│   │   │
│   │   └── agente/
│   │       ├── AgenteDashboard.jsx
│   │       ├── PropiedadesAgente.jsx
│   │       └── PerfilAgente.jsx
│   │
│   ├── routes/
│   │   └── AppRouter.jsx        ← centraliza rutas públicas y privadas
│   │
│   ├── services/
│   │   └── api.js               ← peticiones al backend
│   │
│   ├── context/
│   │   └── AuthContext.jsx      ← manejo de login y roles
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
└── package.json

⚙️ Configuración básica de rutas (react-router-dom)

Instala si aún no lo tienes:

npm install react-router-dom

🧭 src/routes/AppRouter.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import Propiedades from "../pages/Propiedades";
import Contacto from "../pages/Contacto";
import NotFound from "../pages/NotFound";

import AdminDashboard from "../dashboard/admin/AdminDashboard";
import AgenteDashboard from "../dashboard/agente/AgenteDashboard";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/propiedades" element={<Propiedades />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* Rutas protegidas */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="Administrador">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agente/*"
          element={
            <ProtectedRoute role="Agente">
              <AgenteDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

🧩 src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.rol !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

🔑 src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Simulación de sesión
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

🖥️ Dashboards base
🧑‍💼 src/dashboard/admin/AdminDashboard.jsx
import { Link, Routes, Route } from "react-router-dom";
import PropiedadesAdmin from "./PropiedadesAdmin";
import UsuariosAdmin from "./UsuariosAdmin";
import ReportesAdmin from "./ReportesAdmin";

export default function AdminDashboard() {
  return (
    <div className="dashboard">
      <aside>
        <h2>Panel Admin</h2>
        <nav>
          <Link to="propiedades">Propiedades</Link>
          <Link to="usuarios">Usuarios</Link>
          <Link to="reportes">Reportes</Link>
        </nav>
      </aside>

      <main>
        <Routes>
          <Route path="propiedades" element={<PropiedadesAdmin />} />
          <Route path="usuarios" element={<UsuariosAdmin />} />
          <Route path="reportes" element={<ReportesAdmin />} />
        </Routes>
      </main>
    </div>
  );
}

🧑‍💻 src/dashboard/agente/AgenteDashboard.jsx
import { Link, Routes, Route } from "react-router-dom";
import PropiedadesAgente from "./PropiedadesAgente";
import PerfilAgente from "./PerfilAgente";

export default function AgenteDashboard() {
  return (
    <div className="dashboard">
      <aside>
        <h2>Panel Agente</h2>
        <nav>
          <Link to="propiedades">Mis Propiedades</Link>
          <Link to="perfil">Perfil</Link>
        </nav>
      </aside>

      <main>
        <Routes>
          <Route path="propiedades" element={<PropiedadesAgente />} />
          <Route path="perfil" element={<PerfilAgente />} />
        </Routes>
      </main>
    </div>
  );
}

🚀 Integración en App.jsx
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;

✅ Qué logras con esta estructura

Separas frontend público (Inicio, Registro, Propiedades, Contacto).

Creas rutas privadas para Admin y Agente.

Cada rol tiene su propio dashboard independiente.

Ya puedes construir las interfaces dentro de cada módulo.

El componente ProtectedRoute evita accesos no autorizados.