🧾 README.md general — ubicado en inmogestion-frontend/
# InmoGestión Frontend

Este es el frontend del proyecto **InmoGestión**, desarrollado con **React**, **Vite** y **TailwindCSS**. Aquí se construye la interfaz de usuario que se conecta al backend (API) para mostrar propiedades, gestionar contactos y más.

---

## 🛠️ Tecnologías

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## ▶️ Cómo ejecutar el proyecto

1. Instalar dependencias:

```bash
npm install


Levantar el servidor de desarrollo:

npm run dev


Accede desde tu navegador en:
http://localhost:5173

📁 Estructura del proyecto
inmogestion-frontend/
├── src/
│   ├── assets/          # Imágenes, íconos, logos
│   ├── components/      # Componentes reutilizables (NavBar, Footer, Cards, etc.)
│   ├── pages/           # Páginas completas (Home, Propiedades, Contacto, etc.)
│   ├── App.jsx          # Componente raíz de la app
│   ├── index.css        # Tailwind + estilos globales
│   └── main.jsx         # Entrada principal (punto de arranque de React)
├── index.html           # HTML base
├── package.json         # Configuración de dependencias
├── tailwind.config.js   # Configuración de Tailwind
└── postcss.config.js    # Configuración de PostCSS

📦 Build para producción
npm run build


Esto generará los archivos listos para producción en la carpeta dist/.

✍️ Autor

Proyecto creado por Juan Sebastian Tique Rodriguez.
Repositorio: github.com/tiquesebastian53@gmail.com/InmoGestion


---

## 🧾 `src/README.md` — específico para el contenido de `src/`

> Este archivo puede estar en `inmogestion-frontend/src/README.md`

```markdown
# Estructura del código fuente (`/src`)

Este directorio contiene todo el código fuente del frontend de InmoGestión.

---

## 📁 Directorios

### `assets/`
Contiene recursos estáticos como:

- Imágenes (`.jpg`, `.png`)
- Íconos (`.svg`)
- Logos

---

### `components/`
Componentes reutilizables que pueden ser usados en múltiples partes de la app:

- `NavBar.jsx`
- `Footer.jsx`
- `Card.jsx`

💡 Mantén los componentes pequeños, reutilizables y enfocados en una sola tarea.

---

### `pages/`
Cada archivo aquí representa una **página completa**:

- `Home.jsx` — Página de inicio
- `Propiedades.jsx` — Listado de propiedades
- `Contacto.jsx` — Formulario de contacto

Las rutas de React (con React Router) generalmente se conectan aquí.

---

## 📄 Archivos principales

### `App.jsx`
El componente raíz donde se estructura la aplicación. Aquí se pueden definir rutas o layout general.

### `main.jsx`
Punto de entrada. React renderiza el componente `<App />` en el DOM aquí.

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

index.css

Estilos globales de la aplicación. Aquí se importan las directivas de Tailwind:

@tailwind base;
@tailwind components;
@tailwind utilities;