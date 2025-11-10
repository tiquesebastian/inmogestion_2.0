# 📦 Guía de Deployment y Portabilidad - InmoGestión

## 🚀 Índice
1. [Requisitos del Sistema](#requisitos)
2. [Configuración de Gmail](#gmail)
3. [Instalación y Configuración](#instalacion)
4. [Variables de Entorno](#variables)
5. [Portabilidad del Proyecto](#portabilidad)
6. [Funcionalidades Implementadas](#funcionalidades)

---

## 📋 Requisitos del Sistema {#requisitos}

### Software Necesario
- **Node.js**: v18.0.0 o superior
- **MySQL**: v8.0 o superior
- **npm** o **yarn**: Gestor de paquetes
- **Git**: Para clonar el repositorio

### Puertos Necesarios
- **Backend**: 4000
- **Frontend**: 5173 (Vite)
- **MySQL**: 3306

---

## 📧 Configuración de Gmail para Envío de Correos {#gmail}

### Paso 1: Crear Contraseña de Aplicación en Gmail

1. **Accede a tu cuenta de Gmail** y ve a [myaccount.google.com](https://myaccount.google.com)

2. **Habilita verificación en 2 pasos:**
   - Ve a **Seguridad** → **Verificación en 2 pasos**
   - Actívala si no la tienes

3. **Genera una Contraseña de Aplicación:**
   - Ve a **Seguridad** → **Contraseñas de aplicaciones**
   - Selecciona **Correo** y **Windows Computer** (o tu dispositivo)
   - Google generará una contraseña de 16 caracteres
   - **COPIA Y GUARDA** esta contraseña

### Paso 2: Configurar las Variables de Entorno

En el archivo `.env` del backend (`.vscode/.env`):

```env
# Configuración de Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # La contraseña de aplicación de 16 dígitos
EMAIL_FROM="InmoGestión <tu_email@gmail.com>"
```

### Funcionalidades de Email Disponibles

✅ **Recuperación de Contraseña**
- Envía email con token de recuperación
- Token válido por 1 hora
- Funciona para usuarios (admin/agente) y clientes

✅ **Notificación de Contrato Generado**
- Email al cliente cuando se genera su contrato
- Incluye detalles del inmueble y enlace de descarga

✅ **Notificación de Nuevo Interés**
- Email al agente cuando un cliente muestra interés
- Incluye datos del cliente y propiedad

✅ **Recordatorios de Visitas**
- Email automático 24h antes de la visita
- Incluye datos de la propiedad y hora

---

## 🔧 Instalación y Configuración {#instalacion}

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tiquesebastian/InmoGestion.git
cd InmoGestion
```

### 2. Configurar Backend

```bash
# Navegar a la carpeta del backend
cd .vscode

# Instalar dependencias
npm install

# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus datos (ver sección Variables de Entorno)

# Configurar base de datos
mysql -u root -p < db/schema.sql
mysql -u root -p inmogestion < db/seeds.sql

# Iniciar servidor
npm start
```

### 3. Configurar Frontend

```bash
# En una nueva terminal, navegar al frontend
cd inmogestion-frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### 4. Acceder a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Panel Admin**: http://localhost:5173/inmogestion

---

## 🔐 Variables de Entorno {#variables}

### Backend (`.vscode/.env`)

```env
# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=inmogestion
DB_PORT=3306

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_cambiame

# Servidor
PORT=4000
NODE_ENV=production  # O 'development' para desarrollo

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # Contraseña de aplicación de Gmail
EMAIL_FROM="InmoGestión <tu_email@gmail.com>"
```

### Frontend (`inmogestion-frontend/.env`)

```env
# URL del backend (ajustar en producción)
VITE_API_URL=http://localhost:4000

# URL del frontend (ajustar en producción)
VITE_APP_URL=http://localhost:5173
```

---

## 🌐 Portabilidad del Proyecto {#portabilidad}

### ✅ ¿Se puede portar a otro servidor/computadora?

**SÍ, el proyecto es 100% portable.** Solo necesitas:

1. Tener instalado Node.js y MySQL
2. Configurar las variables de entorno
3. Importar la base de datos
4. Instalar dependencias

### 📝 Pasos para Migrar a Otro Servidor

#### Opción 1: Servidor Local/VPS

```bash
# 1. Instalar requisitos
sudo apt update
sudo apt install nodejs npm mysql-server git

# 2. Clonar proyecto
git clone https://github.com/tiquesebastian/InmoGestion.git
cd InmoGestion

# 3. Configurar backend
cd .vscode
npm install
cp .env.example .env
# Editar .env con credenciales del nuevo servidor

# 4. Importar base de datos
mysql -u root -p < db/schema.sql

# 5. Configurar frontend
cd ../inmogestion-frontend
npm install
npm run build  # Para producción

# 6. Iniciar servicios
# Backend
cd ../.vscode
npm start

# Frontend (con PM2 para producción)
npm install -g pm2
pm2 start npm --name "inmogestion-frontend" -- start
```

#### Opción 2: Hosting Web (ej: Vercel + Railway)

**Frontend en Vercel:**
```bash
# En inmogestion-frontend/
npm run build
vercel --prod
```

**Backend en Railway/Heroku:**
```bash
# Configurar variables de entorno en el panel
# Conectar con repositorio Git
# Deploy automático
```

### 🔧 Configuración de URLs en Producción

**Backend (`server.js`):**
```javascript
// Actualizar CORS para permitir el dominio de producción
app.use(cors({
  origin: 'https://tu-dominio.com',
  credentials: true
}));
```

**Frontend (`src/services/api.js`):**
```javascript
// Actualizar URL base del API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.tu-dominio.com';
```

---

## ✨ Funcionalidades Implementadas {#funcionalidades}

### 🔐 Recuperación de Contraseña

✅ **Funcionamiento Completo:**
- Token único de 32 bytes
- Expiración de 1 hora
- Funciona para usuarios y clientes
- Email con enlace de restablecimiento
- Validación de token en BD

**Flujo:**
1. Usuario solicita recuperación → `/api/password-recovery/forgot-password-usuario`
2. Backend genera token y lo guarda en BD
3. Envía email con enlace: `http://localhost:5173/reset-password?token=xxxxx`
4. Usuario ingresa nueva contraseña
5. Backend valida token y actualiza contraseña

**Modo Desarrollo:**
Si no tienes Gmail configurado, el sistema devuelve el token en la respuesta JSON para testing.

### 📄 Generación de Contratos PDF

✅ **Implementado con Puppeteer:**
- Genera contratos en PDF
- Templates HTML personalizados
- Guarda en `/uploads/contratos/`
- Email automático al cliente
- Descarga desde panel de cliente

**Tipos de Contrato:**
- Apartamento
- Casa
- Lote

**Características:**
- Datos dinámicos del cliente y propiedad
- Formato legal profesional
- Numeración automática
- Fecha y firmas

### 📊 Sistema de Reportes

✅ **Reportes Disponibles:**

1. **Reporte de Propiedades**
   - Total de propiedades por estado
   - Propiedades por tipo
   - Promedio de precios

2. **Reporte de Clientes**
   - Total de clientes registrados
   - Clientes con contratos
   - Documentos cargados

3. **Reporte de Contratos**
   - Contratos por estado
   - Ventas totales
   - Contratos por agente

4. **Reporte de Visitas**
   - Visitas programadas
   - Tasa de conversión
   - Visitas por propiedad

### 🔔 Notificaciones por Email

✅ **Todas las notificaciones funcionan:**
- ✉️ Contrato generado
- ✉️ Nuevo interés en propiedad
- ✉️ Recordatorio de visita (24h antes)
- ✉️ Recuperación de contraseña

---

## 🛡️ Seguridad

### Validaciones Implementadas

✅ **Contraseñas Seguras:**
- Mínimo 8 caracteres
- Mayúsculas y minúsculas
- Números
- Caracteres especiales

✅ **Emails Validados:**
- Formato RFC 5322
- Verificación en tiempo real

✅ **Teléfonos:**
- Formato colombiano: 3XXXXXXXXX

✅ **Documentos:**
- Cédula: 6-10 dígitos

### Protección

- Contraseñas hasheadas con bcrypt (10 rounds)
- Tokens JWT con expiración
- Tokens de recuperación únicos y temporales
- CORS configurado
- Sanitización de inputs

---

## 📱 Responsive Design

✅ **Todos los formularios son responsive:**
- Breakpoints: mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
- Grid adaptativo (1 columna en móvil, 2 en desktop)
- Touch-friendly en móviles
- Botones de tamaño adecuado
- Inputs con validación visual

---

## 🐛 Solución de Problemas

### Error: Cannot send email

**Causa:** Gmail bloqueando el acceso

**Solución:**
1. Verifica que uses Contraseña de Aplicación (no tu contraseña normal)
2. Verifica verificación en 2 pasos esté activa
3. Revisa que EMAIL_USER y EMAIL_PASS estén correctos en `.env`

### Error: Connection refused 4000

**Causa:** Backend no está corriendo

**Solución:**
```bash
cd .vscode
npm start
```

### Error: Cannot connect to MySQL

**Causa:** Credenciales incorrectas o MySQL no está corriendo

**Solución:**
```bash
# Verificar que MySQL esté corriendo
sudo systemctl status mysql

# Verificar credenciales en .env
DB_USER=root
DB_PASSWORD=tu_password_correcto
```

### Frontend no carga

**Causa:** Dependencias no instaladas

**Solución:**
```bash
cd inmogestion-frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📞 Soporte

Para más ayuda, contacta al equipo de desarrollo o crea un issue en GitHub.

**Desarrollado con ❤️ por el equipo InmoGestión**
