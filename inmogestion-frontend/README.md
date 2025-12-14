# 🏡 InmoGestión - Frontend

![React](https://img.shields.io/badge/React-19-blue.svg)
![Vite](https://img.shields.io/badge/Vite-7-purple.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-cyan.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

Interfaz de usuario moderna para la plataforma InmoGestión. Construida con React, Vite y TailwindCSS.

Nota de redeploy: actualización menor para forzar build en Vercel.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Componentes](#-componentes-principales)
- [Rutas](#-rutas-de-la-aplicación)
- [Desarrollo](#-desarrollo)

---

## ✨ Características

### Área Pública
- 🏠 **Página de inicio** con propiedades destacadas
- 🔍 **Búsqueda avanzada** con filtros múltiples
- 📱 **Diseño responsive** para todos los dispositivos
- 📷 **Galería de imágenes** de propiedades
- 💬 **Formulario de contacto** integrado
- 📧 **Registro de interés** en propiedades

### Dashboard de Administrador
- 📊 **Estadísticas en tiempo real**
- 👥 **Gestión de usuarios y agentes**
- 🏢 **CRUD completo de propiedades**
- 📝 **Reportes avanzados** con gráficos
- 📋 **Gestión de contratos**
- 🔍 **Auditoría del sistema**

### Dashboard de Agente
- 🏠 **Mis propiedades** asignadas
- 👤 **Gestión de clientes**
- 📅 **Agenda de visitas**
- 💼 **Contratos activos**
- 📊 **Mi rendimiento**

### Dashboard de Cliente
- ❤️ **Propiedades favoritas**
- 📜 **Historial de intereses**
- 📞 **Mis consultas**
- 👤 **Perfil personal**

---

## 🛠️ Tecnologías

| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| **React** | 19.1.1 | Librería de UI |
| **Vite** | 7.1.2 | Build tool y dev server |
| **TailwindCSS** | 4.1.12 | Framework de CSS |
| **React Router DOM** | 7.9.5 | Enrutamiento |
| **Axios** | 1.12.2 | Cliente HTTP |
| **Heroicons** | 2.2.0 | Iconos |
| **EmailJS** | 3.2.0 | Servicio de email |
| **jwt-decode** | 4.0.0 | Decodificador de JWT |

### Herramientas de Desarrollo

| Herramienta | Versión | Descripción |
|------------|---------|-------------|
| **ESLint** | 9.33.0 | Linter de código |
| **Prettier** | 3.6.2 | Formateo de código |
| **Nodemon** | 3.1.10 | Hot reload |

---

## 📂 Estructura del Proyecto

```
inmogestion-frontend/
│
├── public/
│   ├── images/                         # Imágenes públicas
│   └── politica-privacidad.html        # Políticas
│
├── src/
│   ├── assets/
│   │   └── inmuebles.js                # Datos de ejemplo
│   │
│   ├── components/                     # Componentes reutilizables
│   │   ├── Navbar.jsx                  # Barra de navegación
│   │   ├── Footer.jsx                  # Pie de página
│   │   ├── HeroConSlider.jsx           # Hero con slider
│   │   ├── FilteredProperties.jsx      # Filtro de propiedades
│   │   ├── PropertyDetail.jsx          # Detalle de propiedad
│   │   ├── ContactForm.jsx             # Formulario de contacto
│   │   ├── ClientRegistration.jsx      # Registro de cliente
│   │   ├── Breadcrumbs.jsx             # Navegación de ruta
│   │   └── ProtectedRoute.jsx          # Ruta protegida
│   │
│   ├── context/
│   │   └── AuthContext.jsx             # Contexto de autenticación
│   │
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx      # Dashboard principal
│   │   │   ├── PropiedadesAdmin.jsx    # Gestión de propiedades
│   │   │   ├── UsuariosAdmin.jsx       # Gestión de usuarios
│   │   │   ├── RegistrarAgente.jsx     # Registro de agentes
│   │   │   ├── RegistrarPropiedad.jsx  # Registro de propiedades
│   │   │   └── ReportesAdmin.jsx       # Reportes y estadísticas
│   │   │
│   │   ├── agente/
│   │   │   ├── AgenteDashboard.jsx     # Dashboard de agente
│   │   │   ├── PropiedadesAgente.jsx   # Propiedades del agente
│   │   │   ├── PerfilAgente.jsx        # Perfil del agente
│   │   │   └── RegistrarPropiedad.jsx  # Crear propiedad
│   │   │
│   │   └── cliente/
│   │       └── ClienteDashboard.jsx    # Dashboard de cliente
│   │
│   ├── pages/                          # Páginas completas
│   │   ├── Home.jsx                    # Página principal
│   │   ├── inicio.jsx                  # Landing page
│   │   ├── propiedades.jsx             # Listado de propiedades
│   │   ├── agentes.jsx                 # Directorio de agentes
│   │   ├── contacto.jsx                # Página de contacto
│   │   ├── Login.jsx                   # Login general
│   │   ├── InmoGestionLogin.jsx        # Login sistema
│   │   ├── registro.jsx                # Registro general
│   │   ├── RegistroCliente.jsx         # Registro de cliente
│   │   ├── ForgotPassword.jsx          # Recuperar contraseña
│   │   ├── RecuperarContrasena.jsx     # Recuperación genérica
│   │   ├── RecuperarContrasenaCliente.jsx  # Recuperación cliente
│   │   ├── RecuperarContrasenaUsuario.jsx  # Recuperación usuario
│   │   ├── ResetPassword.jsx           # Resetear contraseña
│   │   ├── CargaMasiva.jsx             # Carga masiva de datos
│   │   ├── PoliticaPrivacidad.jsx      # Política de privacidad
│   │   ├── TerminosCondiciones.jsx     # Términos y condiciones
│   │   └── NotFound.jsx                # Página 404
│   │
│   ├── routes/
│   │   └── AppRouter.jsx               # Configuración de rutas
│   │
│   ├── services/
│   │   └── api.js                      # Configuración de Axios
│   │
│   ├── App.jsx                         # Componente principal
│   ├── App.css                         # Estilos del App
│   ├── main.jsx                        # Punto de entrada
│   └── index.css                       # Estilos globales + Tailwind
│
├── .gitignore
├── eslint.config.js                    # Configuración ESLint
├── index.html                          # HTML base
├── package.json                        # Dependencias
├── postcss.config.js                   # Configuración PostCSS
├── vite.config.js                      # Configuración Vite
└── README.md                           # Este archivo
```

---

## 🚀 Instalación

### Prerrequisitos

- **Node.js** v18.0.0 o superior - [Descargar](https://nodejs.org/)
- **npm** (incluido con Node.js)
- **Backend corriendo** en `http://localhost:4000`

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/tiquesebastian/InmoGestion.git
cd InmoGestion/inmogestion-frontend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno** (opcional)

```bash
# Crear archivo .env si es necesario
echo "VITE_API_URL=http://localhost:4000" > .env
```

4. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

✅ La aplicación estará disponible en `http://localhost:5173`

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del frontend (opcional):

```env
# URL del Backend
VITE_API_URL=http://localhost:4000

# EmailJS (opcional - para formulario de contacto)
VITE_EMAIL_SERVICE_ID=tu_service_id_de_emailjs
VITE_EMAIL_TEMPLATE_ID=tu_template_id_de_emailjs
VITE_EMAIL_PUBLIC_KEY=tu_public_key_de_emailjs
```

### Configuración de la API

El archivo `src/services/api.js` configura Axios:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token JWT
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

export default api;
```

### Configuración de Vite

El archivo `vite.config.js` configura el servidor de desarrollo:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5173,
    open: true
  }
});
```

### Configuración de TailwindCSS

TailwindCSS v4 se configura directamente en `src/index.css`:

```css
@import "tailwindcss";

/* Tus estilos personalizados aquí */
```

---

## 💻 Uso

### Comandos Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Crear build de producción
npm run build

# Previsualizar build de producción
npm run preview

# Ejecutar linter
npm run lint

# Formatear código (si está configurado)
npm run format
```

### Acceso al Sistema

1. **Página Principal**: `http://localhost:5173/`
2. **Login de Usuarios**: `http://localhost:5173/login`
3. **Registro de Clientes**: `http://localhost:5173/registro-cliente`
4. **Búsqueda de Propiedades**: `http://localhost:5173/propiedades`
5. **Contacto**: `http://localhost:5173/contacto`

### Flujo de Usuario

#### Cliente No Registrado
```
Inicio → Buscar Propiedades → Ver Detalle → Registrar Interés
```

#### Cliente Registrado
```
Login → Dashboard → Ver Favoritos → Contactar Agente
```

#### Agente
```
Login → Dashboard → Gestionar Propiedades → Agendar Visitas → Crear Contratos
```

#### Administrador
```
Login → Dashboard → Ver Reportes → Gestionar Usuarios → Administrar Sistema
```

---

## 🧩 Componentes Principales

### Navbar.jsx
Barra de navegación con menú responsive y autenticación.

```jsx
<Navbar />
```

**Características:**
- Menú hamburguesa en móvil
- Enlaces condicionales según autenticación
- Logo y navegación principal

### FilteredProperties.jsx
Componente de búsqueda y filtrado de propiedades.

```jsx
<FilteredProperties />
```

**Filtros disponibles:**
- Tipo de propiedad
- Rango de precio
- Localidad
- Barrio
- Estado

### PropertyDetail.jsx
Detalle completo de una propiedad con galería.

```jsx
<PropertyDetail propertyId={id} />
```

**Incluye:**
- Galería de imágenes
- Información detallada
- Mapa de ubicación
- Formulario de contacto

### HeroConSlider.jsx
Hero section con slider de propiedades destacadas.

```jsx
<HeroConSlider />
```

### ContactForm.jsx
Formulario de contacto integrado con EmailJS.

```jsx
<ContactForm />
```

### ProtectedRoute.jsx
Componente para proteger rutas según autenticación y rol.

```jsx
<ProtectedRoute allowedRoles={['admin', 'agente']}>
  <ComponenteProtegido />
</ProtectedRoute>
```

---

## 🗺️ Rutas de la Aplicación

### Rutas Públicas

```javascript
/                           → Home (Landing Page)
/inicio                     → Página de inicio
/propiedades                → Listado de propiedades
/propiedades/:id            → Detalle de propiedad
/agentes                    → Directorio de agentes
/contacto                   → Formulario de contacto
/registro-cliente           → Registro de clientes
/login                      → Login general
/recuperar-contrasena       → Recuperar contraseña
/politica-privacidad        → Política de privacidad
/terminos-condiciones       → Términos y condiciones
```

### Rutas Protegidas - Admin

```javascript
/admin/dashboard            → Dashboard principal
/admin/propiedades          → Gestión de propiedades
/admin/usuarios             → Gestión de usuarios
/admin/registrar-agente     → Registro de agentes
/admin/registrar-propiedad  → Registro de propiedades
/admin/reportes             → Reportes y estadísticas
```

### Rutas Protegidas - Agente

```javascript
/agente/dashboard           → Dashboard de agente
/agente/propiedades         → Mis propiedades
/agente/perfil              → Mi perfil
/agente/registrar-propiedad → Crear propiedad
```

### Rutas Protegidas - Cliente

```javascript
/cliente/dashboard          → Dashboard de cliente
```

---

## 🎨 Estilos y Temas

### TailwindCSS

El proyecto usa TailwindCSS v4 para los estilos. Clases principales:

```css
/* Colores principales */
bg-blue-600      → Azul principal
bg-green-500     → Verde acciones
bg-red-500       → Rojo alertas

/* Espaciado */
p-4, p-6, p-8    → Padding
m-4, m-6, m-8    → Margin

/* Responsive */
sm:              → 640px+
md:              → 768px+
lg:              → 1024px+
xl:              → 1280px+
```

### CSS Personalizado

Los estilos personalizados están en:
- `src/index.css` - Estilos globales
- `src/App.css` - Estilos del componente App

---

## 🔐 Autenticación

### AuthContext

El contexto de autenticación maneja el estado global del usuario:

```javascript
import { useAuth } from './context/AuthContext';

function MiComponente() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Usar en el componente
}
```

**Funciones disponibles:**
- `login(email, password)` - Iniciar sesión
- `logout()` - Cerrar sesión
- `isAuthenticated()` - Verificar autenticación
- `user` - Datos del usuario actual

### Almacenamiento Local

```javascript
// Token JWT
localStorage.getItem('token')
localStorage.setItem('token', tokenJWT)

// Datos del usuario
localStorage.getItem('user')
localStorage.setItem('user', JSON.stringify(userData))
```

---

## 📱 Responsive Design

El diseño es completamente responsive con breakpoints:

```javascript
// Móvil
< 640px     → Diseño móvil

// Tablet
640px - 1024px → Diseño tablet

// Desktop
> 1024px    → Diseño desktop
```

---

## 🧪 Desarrollo

### Agregar un Nuevo Componente

1. Crear el archivo en `src/components/`
2. Definir el componente:

```jsx
// src/components/MiComponente.jsx
export default function MiComponente({ props }) {
  return (
    <div className="p-4">
      {/* Contenido */}
    </div>
  );
}
```

3. Importar donde se necesite:

```jsx
import MiComponente from './components/MiComponente';
```

### Agregar una Nueva Página

1. Crear el archivo en `src/pages/`
2. Configurar la ruta en `src/routes/AppRouter.jsx`

```jsx
import MiPagina from '../pages/MiPagina';

// En el router
<Route path="/mi-pagina" element={<MiPagina />} />
```

### Conectar con el Backend

```javascript
import api from '../services/api';

// GET
const datos = await api.get('/api/endpoint');

// POST
const response = await api.post('/api/endpoint', { datos });

// PUT
const updated = await api.put('/api/endpoint/:id', { datos });

// DELETE
await api.delete('/api/endpoint/:id');
```

---

## 📦 Build para Producción

### Crear Build

```bash
npm run build
```

Los archivos se generan en la carpeta `dist/`:

```
dist/
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── index.html
```

### Previsualizar Build

```bash
npm run preview
```

### Deploy

El build de producción puede desplegarse en:

- **Vercel**: `vercel deploy`
- **Netlify**: Arrastra la carpeta `dist/`
- **GitHub Pages**: Configura en repositorio
- **AWS S3**: Sube la carpeta `dist/`

---

## 🔧 Solución de Problemas

### Error: "Cannot connect to backend"

Verifica que:
1. El backend esté corriendo en `http://localhost:4000`
2. La URL en `VITE_API_URL` sea correcta
3. No haya problemas de CORS

### Error: "Module not found"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error en Hot Reload

```bash
# Reiniciar el servidor de desarrollo
# Ctrl+C para detener
npm run dev
```

### Estilos de Tailwind no se aplican

1. Verifica que `@import "tailwindcss"` esté en `src/index.css`
2. Reinicia el servidor
3. Limpia caché del navegador

---

## 📚 Recursos Adicionales

- [Documentación de React](https://react.dev/)
- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de TailwindCSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)

---

## 🤝 Contribuir

Consulta el README principal del proyecto para guías de contribución.

---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

## 👥 Equipo de Desarrollo

- **Juan Sebastian Tique Rodriguez** - Developer
- **Yosman Fernando Espinosa** - Developer
- **Yair Esteban Peña** - Developer

---

## 📧 Soporte

Para problemas o preguntas:
- 📧 Email: tiquesebastian53@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/tiquesebastian/InmoGestion/issues)

---

**Desarrollado con ❤️ por el equipo de InmoGestión**
