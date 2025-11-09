# 📁 Directorio `/src` - Código Fuente Frontend

Este directorio contiene todo el código fuente de la aplicación frontend de InmoGestión.

---

## 📂 Estructura General

```
src/
├── assets/          # Recursos estáticos (imágenes, datos de ejemplo)
├── components/      # Componentes reutilizables
├── context/         # Contextos de React (AuthContext)
├── dashboard/       # Dashboards por rol (admin, agente, cliente)
├── pages/           # Páginas completas de la aplicación
├── routes/          # Configuración de rutas
├── services/        # Servicios y configuración de API
├── App.jsx          # Componente raíz
├── App.css          # Estilos del componente App
├── main.jsx         # Punto de entrada de React
└── index.css        # Estilos globales + Tailwind
```

---

## 📂 Descripción de Directorios

### `assets/`

Contiene recursos estáticos que se importan directamente en los componentes.

```
assets/
└── inmuebles.js    # Datos de ejemplo de propiedades
```

**Uso:**
```javascript
import { inmuebles } from './assets/inmuebles';
```

**Mejores prácticas:**
- Guarda imágenes pequeñas, iconos y logos aquí
- Para imágenes grandes, considera usar `public/images/`
- Mantén los archivos organizados por tipo

---

### `components/`

Componentes reutilizables que se usan en múltiples partes de la aplicación.

```
components/
├── Navbar.jsx              # Barra de navegación principal
├── Footer.jsx              # Pie de página
├── HeroConSlider.jsx       # Hero con slider de propiedades
├── FilteredProperties.jsx  # Componente de filtrado
├── PropertyDetail.jsx      # Detalle de propiedad individual
├── ContactForm.jsx         # Formulario de contacto
├── ClientRegistration.jsx  # Formulario de registro de cliente
├── Breadcrumbs.jsx         # Navegación de migas de pan
└── ProtectedRoute.jsx      # HOC para rutas protegidas
```

#### Componentes Destacados

**Navbar.jsx**
```jsx
// Barra de navegación responsive con autenticación
<Navbar />
```
- Menú responsive con hamburguesa en móvil
- Links condicionales según el estado de autenticación
- Logo y navegación principal

**FilteredProperties.jsx**
```jsx
// Búsqueda y filtrado de propiedades
<FilteredProperties />
```
- Filtros por tipo, precio, localidad, barrio
- Búsqueda en tiempo real
- Paginación de resultados

**ProtectedRoute.jsx**
```jsx
// Protección de rutas por rol
<ProtectedRoute allowedRoles={['admin']}>
  <ComponenteProtegido />
</ProtectedRoute>
```
- Verifica autenticación JWT
- Valida roles de usuario
- Redirecciona si no autorizado

**Mejores prácticas:**
- Mantén componentes pequeños y enfocados (< 300 líneas)
- Un componente = una responsabilidad
- Usa PropTypes o TypeScript para validar props
- Exporta como default si solo exportas un componente

---

### `context/`

Contextos de React para compartir estado global.

```
context/
└── AuthContext.jsx    # Contexto de autenticación
```

**AuthContext.jsx**

Provee autenticación y gestión de usuario a toda la app.

```jsx
import { useAuth } from '../context/AuthContext';

function MiComponente() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Bienvenido, {user.nombre}</p>
      ) : (
        <button onClick={login}>Iniciar sesión</button>
      )}
    </div>
  );
}
```

**API disponible:**
- `user` - Objeto con datos del usuario actual
- `login(email, password)` - Función para iniciar sesión
- `logout()` - Función para cerrar sesión
- `isAuthenticated` - Booleano de estado de autenticación
- `loading` - Estado de carga

**Mejores prácticas:**
- Usa Context para estado global (auth, tema, idioma)
- NO uses Context para todo - solo para estado compartido
- Considera Redux/Zustand si el estado crece mucho

---

### `dashboard/`

Dashboards específicos para cada tipo de usuario.

```
dashboard/
├── admin/
│   ├── AdminDashboard.jsx       # Dashboard principal del admin
│   ├── PropiedadesAdmin.jsx     # CRUD de propiedades
│   ├── UsuariosAdmin.jsx        # Gestión de usuarios
│   ├── RegistrarAgente.jsx      # Formulario de registro de agentes
│   ├── RegistrarPropiedad.jsx   # Formulario de propiedades
│   └── ReportesAdmin.jsx        # Reportes y estadísticas
│
├── agente/
│   ├── AgenteDashboard.jsx      # Dashboard del agente
│   ├── PropiedadesAgente.jsx    # Propiedades del agente
│   ├── PerfilAgente.jsx         # Perfil del agente
│   └── RegistrarPropiedad.jsx   # Crear nueva propiedad
│
└── cliente/
    └── ClienteDashboard.jsx     # Dashboard del cliente
```

#### Dashboards por Rol

**Admin Dashboard**
- Vista general de métricas
- Acceso a todas las funciones del sistema
- Gestión de usuarios y propiedades
- Reportes avanzados

**Agente Dashboard**
- Mis propiedades asignadas
- Clientes y leads
- Agenda de visitas
- Contratos activos

**Cliente Dashboard**
- Propiedades favoritas
- Historial de búsquedas
- Consultas realizadas
- Información de perfil

**Mejores prácticas:**
- Separa dashboards por rol
- Reutiliza componentes comunes
- Implementa lazy loading para dashboards grandes

---

### `pages/`

Páginas completas de la aplicación. Cada archivo representa una ruta.

```
pages/
├── Home.jsx                          # Página principal
├── inicio.jsx                        # Landing page
├── propiedades.jsx                   # Listado de propiedades
├── agentes.jsx                       # Directorio de agentes
├── contacto.jsx                      # Página de contacto
│
├── Login.jsx                         # Login general
├── InmoGestionLogin.jsx              # Login del sistema
├── registro.jsx                      # Registro general
├── RegistroCliente.jsx               # Registro de cliente
│
├── ForgotPassword.jsx                # Recuperar contraseña
├── RecuperarContrasena.jsx           # Recuperación genérica
├── RecuperarContrasenaCliente.jsx    # Recuperación para clientes
├── RecuperarContrasenaUsuario.jsx    # Recuperación para usuarios
├── ResetPassword.jsx                 # Resetear contraseña
│
├── CargaMasiva.jsx                   # Carga masiva de datos
├── PoliticaPrivacidad.jsx            # Política de privacidad
├── TerminosCondiciones.jsx           # Términos y condiciones
└── NotFound.jsx                      # Página 404
```

#### Páginas Principales

**Home.jsx**
- Página principal del sitio
- Hero section con propiedades destacadas
- Llamados a la acción (CTA)
- Secciones informativas

**propiedades.jsx**
- Listado completo de propiedades
- Integra `FilteredProperties` component
- Paginación de resultados
- Vista de grid/lista

**Login.jsx / InmoGestionLogin.jsx**
- Formulario de inicio de sesión
- Validación de credenciales
- Redirección según rol
- Enlace a recuperación de contraseña

**Mejores prácticas:**
- Una página = un archivo
- Importa y compone componentes
- Gestiona estado local de la página aquí
- Usa React Router para navegación

---

### `routes/`

Configuración de todas las rutas de la aplicación.

```
routes/
└── AppRouter.jsx    # Configurador principal de rutas
```

**AppRouter.jsx**

Define todas las rutas de la aplicación usando React Router DOM.

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home';
import AdminDashboard from '../dashboard/admin/AdminDashboard';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/propiedades" element={<Propiedades />} />
        
        {/* Rutas protegidas */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

**Tipos de rutas:**
- **Públicas**: Accesibles sin autenticación
- **Protegidas**: Requieren autenticación
- **Por rol**: Requieren autenticación + rol específico

---

### `services/`

Servicios y configuración para comunicación con el backend.

```
services/
└── api.js    # Configuración de Axios
```

**api.js**

Instancia configurada de Axios para llamadas HTTP.

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Uso en componentes:**

```javascript
import api from '../services/api';

// GET
const propiedades = await api.get('/api/propiedades');

// POST
const nuevaPropiedad = await api.post('/api/propiedades', datos);

// PUT
const actualizada = await api.put('/api/propiedades/1', datos);

// DELETE
await api.delete('/api/propiedades/1');
```

**Mejores prácticas:**
- Centraliza toda la lógica de API aquí
- Usa interceptors para tokens y errores globales
- Maneja errores de red apropiadamente
- Considera crear servicios específicos (ej: `propiedadesService.js`)

---

## 📄 Archivos Raíz de `/src`

### `main.jsx`

Punto de entrada de la aplicación React.

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- Renderiza el componente `App` en el DOM
- Usa `React.StrictMode` para detectar problemas
- Importa estilos globales

### `App.jsx`

Componente raíz de la aplicación.

```jsx
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
```

- Envuelve la app en providers (AuthContext, etc.)
- Incluye el router principal
- Punto de configuración global

### `index.css`

Estilos globales y configuración de TailwindCSS.

```css
@import "tailwindcss";

/* Estilos globales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Clases de utilidad personalizadas */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
```

### `App.css`

Estilos específicos del componente App.

```css
/* Estilos específicos de App.jsx */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
```

---

## 🎯 Guías de Desarrollo

### Crear un Nuevo Componente

1. **Crea el archivo** en `src/components/`

```jsx
// src/components/MiComponente.jsx
export default function MiComponente({ titulo, children }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold">{titulo}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
```

2. **Importa y usa** en otros componentes

```jsx
import MiComponente from './components/MiComponente';

<MiComponente titulo="Hola Mundo">
  <p>Contenido aquí</p>
</MiComponente>
```

### Crear una Nueva Página

1. **Crea el archivo** en `src/pages/`

```jsx
// src/pages/MiPagina.jsx
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MiPagina() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto py-8">
        <h1>Mi Nueva Página</h1>
        {/* Contenido */}
      </main>
      <Footer />
    </>
  );
}
```

2. **Agrega la ruta** en `src/routes/AppRouter.jsx`

```jsx
import MiPagina from '../pages/MiPagina';

<Route path="/mi-pagina" element={<MiPagina />} />
```

### Consumir una API

```jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function MiComponente() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const response = await api.get('/api/endpoint');
        setDatos(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {datos.map(item => (
        <div key={item.id}>{item.nombre}</div>
      ))}
    </div>
  );
}
```

---

## 🎨 Convenciones de Estilo

### Nombres de Archivos
- Componentes: `PascalCase.jsx` (ej: `MiComponente.jsx`)
- Páginas: `PascalCase.jsx` (ej: `Home.jsx`)
- Utilidades: `camelCase.js` (ej: `formatDate.js`)
- Estilos: `kebab-case.css` (ej: `mi-componente.css`)

### Nombres de Componentes
```jsx
// ✅ Correcto
export default function UserProfile() { }

// ❌ Incorrecto
export default function userprofile() { }
```

### Organización de Imports
```jsx
// 1. Librerías externas
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Componentes
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// 3. Contextos y hooks personalizados
import { useAuth } from '../context/AuthContext';

// 4. Servicios y utilidades
import api from '../services/api';

// 5. Estilos
import './MiComponente.css';
```

---

## 🔑 Mejores Prácticas

### 1. Estado Local vs Global
- **Local**: Usa `useState` para estado de un componente
- **Global**: Usa Context para estado compartido (auth, tema)

### 2. Performance
- Usa `React.memo()` para componentes que no cambian seguido
- Usa `useMemo()` para cálculos costosos
- Usa `useCallback()` para funciones en dependencies de useEffect

### 3. Manejo de Errores
```jsx
try {
  const response = await api.get('/api/datos');
  setDatos(response.data);
} catch (error) {
  console.error('Error:', error);
  setError('No se pudieron cargar los datos');
}
```

### 4. Validación de Formularios
```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!email || !password) {
    setError('Todos los campos son obligatorios');
    return;
  }
  
  // Procesar formulario
};
```

### 5. Limpieza en useEffect
```jsx
useEffect(() => {
  const interval = setInterval(() => {
    // Código
  }, 1000);

  // Limpieza
  return () => clearInterval(interval);
}, []);
```

---

## 📚 Recursos

- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

**¿Necesitas ayuda? Consulta el README principal del proyecto o contacta al equipo.**
