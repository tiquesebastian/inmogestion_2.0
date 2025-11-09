# 🏡 InmoGestión - Backend API

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Express](https://img.shields.io/badge/Express-5.0-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

API RESTful para la gestión inmobiliaria InmoGestión. Construida con Node.js, Express y MySQL.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Endpoints](#-endpoints-de-la-api)
- [Autenticación](#-autenticación)
- [Base de Datos](#-base-de-datos)
- [Desarrollo](#-desarrollo)

---

## ✨ Características

- 🔐 **Autenticación JWT** con roles (Admin, Agente, Cliente)
- 🏠 **CRUD completo** de propiedades, clientes y contratos
- 📊 **Sistema de reportes** avanzado con múltiples métricas
- 📷 **Gestión de imágenes** con Multer
- 🔍 **Búsqueda y filtrado** avanzado de propiedades
- 📧 **Notificaciones** por email con Nodemailer
- 🕓 **Historial de cambios** y auditoría completa
- 💬 **Gestión de interacciones** cliente-agente
- 📅 **Agendamiento de visitas**
- 🌐 **CORS configurado** para desarrollo y producción

---

## 🛠️ Tecnologías

| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| **Node.js** | 18+ | Runtime de JavaScript |
| **Express.js** | 5.1.0 | Framework web |
| **MySQL** | 8.0+ | Base de datos relacional |
| **MySQL2** | 3.14.3 | Driver MySQL para Node.js |
| **jsonwebtoken** | 9.0.2 | Autenticación JWT |
| **bcryptjs** | 3.0.2 | Encriptación de contraseñas |
| **Multer** | 2.0.2 | Upload de archivos |
| **Nodemailer** | 7.0.6 | Envío de emails |
| **dotenv** | 17.2.1 | Variables de entorno |
| **cors** | 2.8.5 | Cross-Origin Resource Sharing |
| **nodemon** | 3.1.10 | Hot reload en desarrollo |

---

## 📂 Estructura del Proyecto

```
.vscode/  (Backend)
│
├── src/
│   ├── config/
│   │   └── db.js                    # Configuración de conexión MySQL
│   │
│   ├── controllers/
│   │   ├── auth.controller.js       # Autenticación de usuarios
│   │   ├── authCliente.controller.js # Autenticación de clientes
│   │   ├── cliente.controller.js    # Lógica de clientes
│   │   ├── propiedad.controller.js  # Lógica de propiedades
│   │   ├── contrato.controller.js   # Lógica de contratos
│   │   ├── reporte.controller.js    # Reportes y estadísticas
│   │   ├── historial.controller.js  # Historial de cambios
│   │   ├── interaccion.controller.js # Interacciones
│   │   ├── visita.controller.js     # Visitas agendadas
│   │   ├── localidad.controller.js  # Localidades y barrios
│   │   ├── imagen.controller.js     # Gestión de imágenes
│   │   └── usuario.controller.js    # Gestión de usuarios
│   │
│   ├── models/
│   │   ├── cliente.model.js         # Queries de clientes
│   │   ├── propiedad.model.js       # Queries de propiedades
│   │   ├── contrato.model.js        # Queries de contratos
│   │   ├── usuario.model.js         # Queries de usuarios
│   │   └── reporte.model.js         # Queries de reportes
│   │
│   ├── routes/
│   │   ├── auth.routes.js           # Rutas de autenticación usuarios
│   │   ├── authCliente.routes.js    # Rutas de autenticación clientes
│   │   ├── cliente.routes.js        # Rutas de clientes
│   │   ├── propiedad.routes.js      # Rutas de propiedades
│   │   ├── contrato.routes.js       # Rutas de contratos
│   │   ├── reporte.routes.js        # Rutas de reportes
│   │   ├── historial.routes.js      # Rutas de historial
│   │   ├── interaccion.routes.js    # Rutas de interacciones
│   │   ├── visita.routes.js         # Rutas de visitas
│   │   ├── localidad.routes.js      # Rutas de localidades
│   │   ├── barrio.routes.js         # Rutas de barrios
│   │   ├── imagen.routes.js         # Rutas de imágenes
│   │   └── usuario.routes.js        # Rutas de usuarios
│   │
│   ├── middleware/
│   │   └── auth.middleware.js       # Verificación JWT y roles
│   │
│   └── server.js                    # Punto de entrada principal
│
├── uploads/                         # Carpeta de imágenes subidas
├── db/                             # Scripts SQL
├── test/                           # Tests (en desarrollo)
├── .env                            # Variables de entorno
├── .env.example                    # Ejemplo de variables
├── package.json                    # Dependencias del proyecto
└── README.md                       # Este archivo
```

---

## 🚀 Instalación

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18.0.0 o superior - [Descargar](https://nodejs.org/)
- **MySQL** v8.0 o superior - [Descargar](https://dev.mysql.com/downloads/mysql/)
- **npm** (incluido con Node.js)
- **Git** - [Descargar](https://git-scm.com/)

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/tiquesebastian/InmoGestion.git
cd InmoGestion/.vscode
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar la base de datos**

```bash
# Acceder a MySQL
mysql -u root -p

# Ejecutar el script de base de datos
mysql> source ../db/schema.sql;
```

4. **Configurar variables de entorno**

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar el archivo .env con tus credenciales
```

5. **Iniciar el servidor**

```bash
# Modo desarrollo (con hot reload)
npm run dev

# Modo producción
npm start
```

✅ El servidor estará corriendo en `http://localhost:4000`

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto backend (`.vscode/.env`) con las siguientes variables:

```env
# ==================================
# CONFIGURACIÓN DEL SERVIDOR
# ==================================
PORT=4000
NODE_ENV=development

# ==================================
# CONFIGURACIÓN DE BASE DE DATOS
# ==================================
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=inmogestion

# ==================================
# JWT - AUTENTICACIÓN
# ==================================
# Genera una clave secreta larga y aleatoria
# Ejemplo: openssl rand -base64 64
JWT_SECRET=tu_clave_secreta_super_segura_y_muy_larga_12345

# ==================================
# EMAIL - NODEMAILER (OPCIONAL)
# ==================================
# Si usas Gmail, necesitas una "contraseña de aplicación"
# https://myaccount.google.com/apppasswords
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=contraseña_de_aplicacion_gmail

# ==================================
# CONFIGURACIÓN DE CORS
# ==================================
# Frontend URL (para producción)
FRONTEND_URL=http://localhost:5173
```

### Configuración de MySQL

Asegúrate de que MySQL esté corriendo:

```bash
# Windows
net start MySQL80

# Linux/Mac
sudo systemctl start mysql
```

---

## 📡 Endpoints de la API

### Base URL

```
http://localhost:4000/api
```

---

### 🔐 Autenticación

#### Usuarios (Agentes/Admin)

```http
POST   /api/auth/register              # Registro de usuario
POST   /api/auth/login                 # Login de usuario
POST   /api/auth/recuperar-usuario     # Solicitar recuperación de contraseña
POST   /api/auth/resetear-usuario      # Resetear contraseña
```

**Ejemplo - Registro:**
```json
POST /api/auth/register
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan.perez@inmogestion.com",
  "contrasena": "Password123!",
  "rol": "agente"
}
```

**Ejemplo - Login:**
```json
POST /api/auth/login
{
  "correo": "juan.perez@inmogestion.com",
  "contrasena": "Password123!"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id_usuario": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "rol": "agente"
  }
}
```

#### Clientes

```http
POST   /api/auth/registro-cliente      # Registro de cliente
POST   /api/auth/login-cliente         # Login de cliente
POST   /api/auth/recuperar             # Solicitar recuperación
POST   /api/auth/resetear              # Resetear contraseña
```

---

### 🏠 Propiedades

```http
GET    /api/propiedades                    # Listar todas las propiedades
GET    /api/propiedades/filter             # Filtrado avanzado
GET    /api/propiedades/:id                # Obtener propiedad por ID
GET    /api/propiedades/:id/intereses      # Listar intereses de una propiedad
POST   /api/propiedades                    # Crear propiedad (🔒 Auth)
POST   /api/propiedades/:id/interest       # Registrar interés en propiedad
PUT    /api/propiedades/:id                # Actualizar propiedad (🔒 Auth)
DELETE /api/propiedades/:id                # Eliminar propiedad (🔒 Auth)
```

**Ejemplo - Filtrado:**
```http
GET /api/propiedades/filter?tipo=Casa&min_price=200000000&max_price=500000000&localidad_id=1&estado=Disponible
```

**Ejemplo - Crear propiedad:**
```json
POST /api/propiedades
Headers: { "Authorization": "Bearer TOKEN_JWT" }
{
  "titulo": "Casa moderna en Usaquén",
  "descripcion": "Hermosa casa con 3 habitaciones...",
  "tipo_propiedad": "Casa",
  "precio": 450000000,
  "area": 180,
  "habitaciones": 3,
  "banos": 2,
  "garajes": 2,
  "direccion": "Calle 100 #15-20",
  "id_localidad": 1,
  "id_barrio": 5,
  "id_usuario": 2,
  "estado_propiedad": "Disponible"
}
```

**Ejemplo - Registrar interés:**
```json
POST /api/propiedades/12/interest
{
  "nombre": "María García",
  "correo": "maria@email.com",
  "telefono": "3001234567",
  "mensaje": "Me interesa conocer más sobre esta propiedad",
  "preferencias": {
    "fecha": "2025-11-15",
    "hora": "10:00"
  }
}
```

---

### 👤 Clientes

```http
GET    /api/clientes                   # Listar clientes (🔒 Auth)
GET    /api/clientes/:id               # Obtener cliente (🔒 Auth)
POST   /api/clientes                   # Crear cliente (🔒 Auth)
PUT    /api/clientes/:id               # Actualizar cliente (🔒 Auth)
DELETE /api/clientes/:id               # Eliminar cliente (🔒 Auth)
```

---

### 📄 Contratos

```http
GET    /api/contratos                      # Listar todos los contratos (🔒 Auth)
GET    /api/contratos/:id                  # Obtener contrato específico (🔒 Auth)
GET    /api/contratos/cliente/:id          # Contratos por cliente (🔒 Auth)
GET    /api/contratos/propiedad/:id        # Contratos por propiedad (🔒 Auth)
POST   /api/contratos                      # Crear contrato (🔒 Auth)
PUT    /api/contratos/:id                  # Actualizar contrato (🔒 Auth)
PATCH  /api/contratos/:id/estado           # Actualizar solo estado (🔒 Auth)
DELETE /api/contratos/:id                  # Eliminar contrato (🔒 Auth)
```

**Ejemplo - Crear contrato:**
```json
POST /api/contratos
Headers: { "Authorization": "Bearer TOKEN_JWT" }
{
  "fecha_contrato": "2025-11-07",
  "valor_venta": 450000000,
  "fecha_venta": "2025-11-10",
  "id_propiedad": 12,
  "id_cliente": 34,
  "id_usuario": 2,
  "estado_contrato": "Activo"
}
```

---

### 📊 Reportes (Solo Admin)

```http
GET    /api/reportes/dashboard                    # Dashboard completo (🔒 Admin)
GET    /api/reportes/ventas/resumen               # Resumen de ventas (🔒 Admin)
GET    /api/reportes/ventas/agentes               # Ventas por agente (🔒 Admin)
GET    /api/reportes/ventas/localidades           # Ventas por localidad (🔒 Admin)
GET    /api/reportes/propiedades/estado           # Propiedades por estado (🔒 Admin)
GET    /api/reportes/propiedades/top-intereses    # Top propiedades (🔒 Admin)
GET    /api/reportes/funnel                       # Funnel de conversión (🔒 Admin)
GET    /api/reportes/clientes/nuevos              # Clientes nuevos (🔒 Admin)
GET    /api/reportes/ventas/tiempo-ciclo          # Tiempo de ciclo de venta (🔒 Admin)
GET    /api/reportes/propiedades/sin-actividad    # Propiedades sin actividad (🔒 Admin)
```

**Ejemplo - Dashboard:**
```http
GET /api/reportes/dashboard?fecha_inicio=2025-10-01&fecha_fin=2025-11-07
Headers: { "Authorization": "Bearer TOKEN_JWT" }
```

---

### 🗺️ Localidades y Barrios

```http
GET    /api/localidades                # Listar todas las localidades
GET    /api/localidades/:id            # Obtener localidad específica
GET    /api/barrios?id_localidad=1     # Obtener barrios por localidad
```

---

### 📅 Visitas

```http
POST   /api/visitas                    # Registrar/agendar visita (🔒 Auth)
```

**Ejemplo:**
```json
POST /api/visitas
Headers: { "Authorization": "Bearer TOKEN_JWT" }
{
  "id_propiedad": 12,
  "id_cliente": 34,
  "fecha_visita": "2025-11-15T10:00:00",
  "notas": "Cliente interesado en visitar el inmueble"
}
```

---

### 🕓 Historial

```http
GET    /api/historial                  # Obtener historial de cambios (🔒 Auth)
POST   /api/historial                  # Registrar cambio manual (🔒 Auth)
DELETE /api/historial/:id              # Eliminar registro (🔒 Auth)
```

---

### 💬 Interacciones

```http
GET    /api/interacciones              # Listar interacciones (🔒 Auth)
POST   /api/interacciones              # Registrar interacción (🔒 Auth)
DELETE /api/interacciones/:id          # Eliminar interacción (🔒 Auth)
```

---

### 📷 Imágenes

```http
POST   /api/imagenes/upload            # Subir imágenes (🔒 Auth)
GET    /uploads/:filename              # Acceder a imagen subida
```

**Ejemplo:**
```http
POST /api/imagenes/upload
Headers: { 
  "Authorization": "Bearer TOKEN_JWT",
  "Content-Type": "multipart/form-data"
}
Body: FormData {
  "imagen": File,
  "id_propiedad": 12
}
```

---

### 👥 Usuarios (Solo Admin)

```http
GET    /api/usuarios                   # Listar usuarios (🔒 Admin)
GET    /api/usuarios/:id               # Obtener usuario (🔒 Admin)
POST   /api/usuarios                   # Crear usuario (🔒 Admin)
PUT    /api/usuarios/:id               # Actualizar usuario (🔒 Admin)
DELETE /api/usuarios/:id               # Eliminar usuario (🔒 Admin)
```

---

## 🔐 Autenticación

### Sistema de Roles

El sistema maneja 3 tipos de roles:

1. **Administrador**: Acceso completo a todas las funcionalidades
2. **Agente**: Gestión de propiedades, clientes y contratos
3. **Cliente**: Acceso a búsqueda y registro de interés

### Uso del Token JWT

Para endpoints protegidos, incluye el token JWT en el header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Middleware de Autenticación

El sistema utiliza dos middlewares principales:

- `verificarToken`: Valida que el usuario esté autenticado
- `verificarRol`: Valida que el usuario tenga el rol adecuado

Ejemplo en las rutas:

```javascript
// Ruta protegida solo para usuarios autenticados
app.use("/api/clientes", verificarToken, clienteRoutes);

// Ruta protegida solo para administradores
app.use("/api/usuarios", verificarToken, verificarRol, usuarioRoutes);
```

---

## 🗄️ Base de Datos

### Esquema Principal

#### Tabla `usuario`
```sql
- id_usuario (INT, PK, AUTO_INCREMENT)
- nombre (VARCHAR)
- apellido (VARCHAR)
- correo (VARCHAR, UNIQUE)
- contrasena (VARCHAR) -- encriptada con bcryptjs
- rol (ENUM: 'administrador', 'agente')
- activo (BOOLEAN)
- fecha_registro (TIMESTAMP)
```

#### Tabla `cliente`
```sql
- id_cliente (INT, PK, AUTO_INCREMENT)
- nombre_cliente (VARCHAR)
- apellido_cliente (VARCHAR)
- documento_cliente (VARCHAR, UNIQUE)
- correo_cliente (VARCHAR, UNIQUE)
- telefono_cliente (VARCHAR)
- contrasena (VARCHAR) -- para clientes registrados
- fecha_registro (TIMESTAMP)
```

#### Tabla `propiedad`
```sql
- id_propiedad (INT, PK, AUTO_INCREMENT)
- titulo (VARCHAR)
- descripcion (TEXT)
- tipo_propiedad (ENUM: 'Casa', 'Apartamento', 'Local', 'Oficina', 'Lote')
- precio (DECIMAL)
- area (DECIMAL)
- habitaciones (INT)
- banos (INT)
- garajes (INT)
- direccion (VARCHAR)
- id_localidad (INT, FK)
- id_barrio (INT, FK)
- id_usuario (INT, FK) -- agente responsable
- estado_propiedad (ENUM: 'Disponible', 'Reservada', 'Vendida', 'Arrendada')
- fecha_registro (TIMESTAMP)
```

#### Tabla `contrato`
```sql
- id_contrato (INT, PK, AUTO_INCREMENT)
- fecha_contrato (DATE)
- valor_venta (DECIMAL)
- fecha_venta (DATE)
- archivo_pdf (VARCHAR)
- id_propiedad (INT, FK)
- id_cliente (INT, FK)
- id_usuario (INT, FK)
- estado_contrato (ENUM: 'Activo', 'Cerrado', 'Cancelado')
```

### Vistas Útiles

```sql
-- Vista de usuarios activos
CREATE VIEW vista_usuarios_activos AS
SELECT id_usuario, nombre, apellido, correo, rol
FROM usuario
WHERE activo = 1;

-- Vista de propiedades disponibles
CREATE VIEW vista_propiedades_disponibles AS
SELECT p.*, l.nombre_localidad, b.nombre_barrio
FROM propiedad p
JOIN localidad l ON p.id_localidad = l.id_localidad
JOIN barrio b ON p.id_barrio = b.id_barrio
WHERE p.estado_propiedad = 'Disponible';
```

### Scripts SQL

Todos los scripts de la base de datos están en la carpeta `../db/`:

- `schema.sql` - Esquema completo con tablas, vistas y triggers
- `data.sql` - Datos de ejemplo (localidades, barrios, usuarios de prueba)

---

## 🧪 Desarrollo

### Comandos Disponibles

```bash
# Iniciar en modo desarrollo (hot reload)
npm run dev

# Iniciar en modo producción
npm start

# Ejecutar tests (en desarrollo)
npm test

# Linting
npm run lint

# Formateo de código
npm run format
```

### Estructura de un Controlador

```javascript
// controllers/ejemplo.controller.js
import db from "../config/db.js";

export const obtenerTodos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tabla");
    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      message: "Error al obtener datos", 
      error: error.message 
    });
  }
};
```

### Estructura de una Ruta

```javascript
// routes/ejemplo.routes.js
import { Router } from "express";
import { obtenerTodos } from "../controllers/ejemplo.controller.js";
import { verificarToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", verificarToken, obtenerTodos);

export default router;
```

### Testing con Bruno/Postman

Puedes probar los endpoints usando:

- **Bruno**: Cliente API open-source
- **Postman**: Cliente API popular
- **Thunder Client**: Extensión de VS Code

Importa la colección de endpoints desde `test/` (si está disponible).

---

## 📝 Buenas Prácticas

1. **Siempre valida los inputs** antes de procesarlos
2. **Maneja errores apropiadamente** con try-catch
3. **Usa transacciones** para operaciones múltiples
4. **Registra acciones críticas** en la tabla de auditoría
5. **No expongas información sensible** en los mensajes de error
6. **Mantén las contraseñas seguras** - nunca en texto plano
7. **Usa prepared statements** para prevenir SQL injection
8. **Documenta cambios importantes** en el código

---

## 🔧 Solución de Problemas

### Error: "Cannot connect to MySQL"

```bash
# Verificar que MySQL esté corriendo
mysql --version

# Iniciar MySQL
# Windows:
net start MySQL80

# Linux/Mac:
sudo systemctl start mysql
```

### Error: "JWT secret is missing"

Asegúrate de tener `JWT_SECRET` en tu archivo `.env`

### Error: "Port 4000 already in use"

```bash
# Cambiar el puerto en .env
PORT=4001
```

### Error: "Module not found"

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Recursos Adicionales

- [Documentación de Express](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT.io](https://jwt.io/)
- [Contrato de API](../docs/API_CONTRACT.md)

---

## 🤝 Contribuir

Consulta el README principal del proyecto para guías de contribución.

---

## 📧 Soporte

Para problemas o preguntas:
- 📧 Email: tiquesebastian53@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/tiquesebastian/InmoGestion/issues)

---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

**Desarrollado con ❤️ por el equipo de InmoGestión**
