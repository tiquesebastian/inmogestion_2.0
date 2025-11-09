# 🏡 InmoGestión

![Backend CI](https://github.com/tiquesebastian/InmoGestion/actions/workflows/backend.yml/badge.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

Plataforma completa de gestión inmobiliaria que permite administrar propiedades, clientes, contratos, reportes y el flujo completo de ventas inmobiliarias.

## 📋 Tabla de Contenidos

- [Características](#-características-principales)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías](#-tecnologías-utilizadas)
- [Instalación](#-instalación-rápida)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [API](#-api-documentation)
- [Equipo](#-equipo-de-desarrollo)
- [Licencia](#-licencia)

---

## ✨ Características Principales

### Para Administradores
- 📊 Dashboard con estadísticas y métricas de ventas
- 👥 Gestión completa de usuarios y agentes
- 🏢 Administración de propiedades
- 📝 Reportes avanzados y análisis de datos
- 🔍 Auditoría completa del sistema

### Para Agentes
- 🏠 Gestión de propiedades asignadas
- 👤 Administración de clientes y leads
- 📅 Agendamiento de visitas
- 💼 Seguimiento de contratos
- 📊 Reportes de rendimiento personal

### Para Clientes
- 🔍 Búsqueda avanzada de propiedades
- 🗺️ Filtros por localidad, barrio y precio
- 📷 Galería de imágenes de propiedades
- 💬 Registro de interés en propiedades
- 📞 Contacto directo con agentes

---

## 📂 Estructura del Proyecto

```
InmoGestion/
│
├── .vscode/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/            # Configuración de base de datos
│   │   ├── controllers/       # Lógica de negocio
│   │   ├── models/            # Modelos de datos (queries)
│   │   ├── routes/            # Definición de endpoints
│   │   ├── middleware/        # Autenticación y validación
│   │   └── server.js          # Punto de entrada del servidor
│   │
│   ├── uploads/               # Imágenes de propiedades
│   ├── .env                   # Variables de entorno
│   └── package.json
│
├── inmogestion-frontend/      # Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/           # Recursos estáticos
│   │   ├── components/       # Componentes reutilizables
│   │   ├── context/          # Context API (AuthContext)
│   │   ├── dashboard/        # Dashboards por rol
│   │   ├── pages/            # Páginas completas
│   │   ├── routes/           # Configuración de rutas
│   │   ├── services/         # Servicios API
│   │   └── main.jsx          # Punto de entrada
│   │
│   └── package.json
│
├── db/                        # Scripts SQL
├── docs/                      # Documentación
└── README.md                  # Este archivo
```

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js v5
- **Base de Datos**: MySQL v8+
- **Autenticación**: JWT (jsonwebtoken)
- **Seguridad**: bcryptjs para encriptación de contraseñas
- **CORS**: Configurado para desarrollo y producción
- **Upload**: Multer para gestión de imágenes
- **Email**: Nodemailer para notificaciones

### Frontend
- **Framework**: React v19
- **Build Tool**: Vite v7
- **Estilos**: TailwindCSS v4
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Iconos**: Heroicons
- **Email Service**: EmailJS

### DevOps & Herramientas
- **Control de Versiones**: Git & GitHub
- **CI/CD**: GitHub Actions
- **Linting**: ESLint
- **Formateo**: Prettier
- **Testing**: En desarrollo

---

## 🚀 Instalación Rápida

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18.0.0 o superior
- [MySQL](https://dev.mysql.com/downloads/mysql/) v8.0 o superior

### Backend existente (.vscode)

El backend real del proyecto ya está en la carpeta `.vscode/` y expone los endpoints bajo el prefijo `/api`.

Para levantarlo:

```powershell
cd .vscode
npm install
npm run dev
```

El servidor se inicia (por defecto) en `http://localhost:4000`.

Si necesitas apuntar el frontend explícitamente usa un archivo `.env` dentro de `inmogestion-frontend`:

```
VITE_API_URL=http://localhost:4000
```

Luego inicia el frontend:

```powershell
cd ../inmogestion-frontend
npm install
npm run dev
```

### Endpoints disponibles relevantes (Visitas / Clientes)

- GET /api/clientes
- GET /api/visitas (query opcional `id_cliente`)
- POST /api/visitas
- PUT /api/visitas/:id
- PATCH /api/visitas/:id/cancelar

Ver más detalles y formato de respuestas en `docs/API_CONTRACT.md`.
- [Git](https://git-scm.com/downloads)
- npm (incluido con Node.js)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tiquesebastian/InmoGestion.git
cd InmoGestion
```

### 2. Configurar la Base de Datos

```bash
# Iniciar sesión en MySQL
mysql -u root -p

# Ejecutar el script de base de datos
mysql> source db/schema.sql;
```

### 3. Configurar Backend

```bash
# Navegar a la carpeta del backend
cd .vscode

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Editar .env con tus credenciales
# Configurar: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET
```

### 4. Configurar Frontend

```bash
# Navegar a la carpeta del frontend
cd ../inmogestion-frontend

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno (si existe)
# Configurar la URL de la API
```

### 5. Iniciar el Proyecto

**Terminal 1 - Backend:**
```bash
cd .vscode
npm run dev
```
✅ Backend corriendo en `http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
cd inmogestion-frontend
npm run dev
```
✅ Frontend corriendo en `http://localhost:5173`

---

## ⚙️ Configuración

### Variables de Entorno - Backend (`.vscode/.env`)

```env
# Servidor
PORT=4000

# Base de Datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_segura
DB_NAME=inmogestion

# JWT - Autenticación
JWT_SECRET=tu_clave_secreta_super_segura_y_larga

# Email - Nodemailer (opcional)
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion

# Entorno
NODE_ENV=development
```

### Variables de Entorno - Frontend (`inmogestion-frontend/.env`)

```env
# API Backend
VITE_API_URL=http://localhost:4000

# EmailJS (opcional, para formularios de contacto)
VITE_EMAIL_SERVICE_ID=tu_service_id
VITE_EMAIL_TEMPLATE_ID=tu_template_id
VITE_EMAIL_PUBLIC_KEY=tu_public_key
```

---

## 💻 Uso

### Acceso al Sistema

1. **Área Pública**: Accede a `http://localhost:5173`
   - Buscar propiedades
   - Ver detalles
   - Registrar interés

2. **Login de Agentes/Admin**: `http://localhost:5173/login`
   - Usuario por defecto se crea en la base de datos
   - Consulta `db/schema.sql` para usuarios de prueba

3. **Registro de Clientes**: `http://localhost:5173/registro-cliente`
   - Los clientes pueden registrarse para guardar búsquedas

### Flujo de Trabajo Típico

```
Cliente → Busca propiedad → Registra interés
   ↓
Agente → Recibe notificación → Agenda visita
   ↓
Agente → Realiza visita → Crea contrato (si hay venta)
   ↓
Admin → Revisa reportes → Analiza métricas
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Endpoints Principales

#### Autenticación
```
POST   /api/auth/register          # Registro de usuarios (admin/agente)
POST   /api/auth/login             # Login de usuarios
POST   /api/auth/recuperar-usuario # Recuperación de contraseña
POST   /api/auth/registro-cliente  # Registro de clientes
POST   /api/auth/login-cliente     # Login de clientes
```

#### Propiedades
```
GET    /api/propiedades                 # Listar todas
GET    /api/propiedades/filter          # Filtrado avanzado
GET    /api/propiedades/:id             # Detalle de propiedad
POST   /api/propiedades                 # Crear propiedad
POST   /api/propiedades/:id/interest    # Registrar interés
PUT    /api/propiedades/:id             # Actualizar propiedad
DELETE /api/propiedades/:id             # Eliminar propiedad
```

#### Clientes
```
GET    /api/clientes           # Listar clientes
GET    /api/clientes/:id       # Obtener cliente
POST   /api/clientes           # Crear cliente
PUT    /api/clientes/:id       # Actualizar cliente
DELETE /api/clientes/:id       # Eliminar cliente
```

#### Contratos
```
GET    /api/contratos                      # Listar todos
GET    /api/contratos/:id                  # Obtener contrato
GET    /api/contratos/cliente/:id          # Por cliente
GET    /api/contratos/propiedad/:id        # Por propiedad
POST   /api/contratos                      # Crear contrato
PUT    /api/contratos/:id                  # Actualizar contrato
PATCH  /api/contratos/:id/estado           # Actualizar estado
DELETE /api/contratos/:id                  # Eliminar contrato
```

#### Reportes (Admin)
```
GET    /api/reportes/dashboard                    # Dashboard completo
GET    /api/reportes/ventas/resumen               # Resumen de ventas
GET    /api/reportes/ventas/agentes               # Ventas por agente
GET    /api/reportes/ventas/localidades           # Ventas por localidad
GET    /api/reportes/propiedades/estado           # Propiedades por estado
GET    /api/reportes/propiedades/top-intereses    # Top propiedades
GET    /api/reportes/funnel                       # Funnel de conversión
GET    /api/reportes/clientes/nuevos              # Clientes nuevos
```

#### Localidades y Barrios
```
GET    /api/localidades        # Todas las localidades
GET    /api/localidades/:id    # Localidad específica
GET    /api/barrios            # Barrios por localidad (query: id_localidad)
```

#### Visitas
```
POST   /api/visitas            # Registrar visita
```

#### Imágenes
```
POST   /api/imagenes/upload    # Subir imágenes
GET    /uploads/:filename      # Obtener imagen
```

Para documentación completa de la API, consulta [docs/API_CONTRACT.md](docs/API_CONTRACT.md)

---

## 🗄️ Base de Datos

### Principales Tablas

- **usuario**: Agentes y administradores del sistema
- **cliente**: Clientes interesados en propiedades
- **localidad**: Localidades de Bogotá
- **barrio**: Barrios por localidad
- **propiedad**: Catálogo de propiedades
- **imagen_propiedad**: Galería de imágenes
- **interes_propiedad**: Registro de interés de clientes
- **visita**: Agendamiento de visitas
- **contrato**: Contratos de venta/arriendo
- **historial_estado_propiedad**: Auditoría de cambios de estado
- **interaccion_cliente**: Interacciones agente-cliente
- **auditoria**: Log de acciones críticas del sistema

### Diagrama ER

Consulta el esquema completo en `db/schema.sql`

---

## 🧪 Testing

```bash
# Backend
cd .vscode
npm test

# Frontend
cd inmogestion-frontend
npm test
```

> **Nota**: Los tests están en desarrollo.

---

## 🔒 Seguridad

- ✅ Autenticación JWT con tokens seguros
- ✅ Contraseñas encriptadas con bcryptjs
- ✅ Validación de inputs en backend
- ✅ CORS configurado correctamente
- ✅ Variables sensibles en archivos `.env`
- ✅ Roles y permisos (Admin, Agente, Cliente)
- ✅ Auditoría de acciones críticas

---

## 📦 Build para Producción

### Backend
```bash
cd .vscode
npm start
```

### Frontend
```bash
cd inmogestion-frontend
npm run build
npm run preview
```

Los archivos de producción estarán en `inmogestion-frontend/dist/`

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Consulta [Git_workflow.md](Git_workflow.md) para más detalles sobre el flujo de trabajo.

---

## 🐛 Solución de Problemas

### Error de conexión a MySQL
```bash
# Verificar que MySQL esté corriendo
mysql --version

# Windows
net start MySQL80

# Verificar credenciales en .env
```

### Puerto en uso
```bash
# Cambiar el puerto en .vscode/.env
PORT=4001

# O en inmogestion-frontend/vite.config.js
```

### Módulos no encontrados
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## 📖 Documentación Adicional

- [Guía de Instalación Completa](INSTALL.md)
- [Contrato de API](docs/API_CONTRACT.md)
- [Configuración de Imágenes](docs/IMAGENES_SETUP.md)
- [Workflow de Git](Git_workflow.md)

---

## 👥 Equipo de Desarrollo

- **Juan Sebastian Tique Rodriguez** - Developer
- **Yosman Fernando Espinosa** - Developer  
- **Yair Esteban Peña** - Developer

---

## 📞 Contacto

**Email**: tiquesebastian53@gmail.com  
**GitHub**: [@tiquesebastian](https://github.com/tiquesebastian)  
**Repositorio**: [InmoGestion](https://github.com/tiquesebastian/InmoGestion)

---

## 📝 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

---

## 🎯 Roadmap

- [x] Sistema de autenticación multi-rol
- [x] CRUD de propiedades
- [x] Sistema de reportes
- [x] Dashboard administrativo
- [x] Gestión de imágenes
- [ ] Documentación con Swagger
- [ ] Tests unitarios y de integración
- [ ] Notificaciones en tiempo real
- [ ] Chat en vivo agente-cliente
- [ ] Integración con WhatsApp Business
- [ ] App móvil (React Native)

---

## ⭐ Agradecimientos

Gracias a todos los que han contribuido a hacer este proyecto posible.

Si te gusta el proyecto, ¡dale una ⭐ en GitHub!

---

**Desarrollado con ❤️ por el equipo de InmoGestión**
