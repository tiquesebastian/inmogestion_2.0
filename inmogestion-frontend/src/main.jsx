// Importa React para poder usar JSX y componentes
import React from "react";

// Importa la nueva API para renderizar en el DOM en React 18+
import ReactDOM from "react-dom/client";

// Importa el componente BrowserRouter para manejar rutas (URLs) en React
import { BrowserRouter } from "react-router-dom";

// Importa el componente principal de la app
import App from "./App.jsx";

// Importa los estilos globales
import "./index.css";

// Importa el proveedor de autenticación para compartir el estado del login entre componentes
import { AuthProvider } from "./context/AuthContext";

// Renderiza la aplicación en el elemento con id="root" en el HTML
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Envolvemos toda la app con BrowserRouter para habilitar rutas */}
    <BrowserRouter>

      {/* Envolvemos con AuthProvider para que cualquier componente pueda acceder a la autenticación */}
      <AuthProvider>

        {/* Renderizamos el componente principal de la aplicacion */}
        <App />

      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
