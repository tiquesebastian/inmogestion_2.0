# InmoGestión – Guía de instalación en Windows (Frontend + Backend + BD)

Esta guía deja el proyecto corriendo localmente con:
- Backend (Node + Express + MySQL) en `http://localhost:4000`
- Frontend (Vite + React) en `http://localhost:5173`

Requisitos:
- Node.js 18+ (recomendado 20 LTS)
- NPM 9+
- MySQL 8.0+
- Git
- VS Code (opcional pero recomendado)

---

## 1) Clonar el repositorio

```powershell
# PowerShell
cd C:\ruta\donde\quiero\clonar
git clone https://github.com/tiquesebastian/InmoGestion.git
cd InmoGestion
```

---

## 2) Base de datos (MySQL)

Tienes dos opciones: Workbench (GUI) o CLI.

### Opción A: MySQL Workbench
1. Abre MySQL Workbench y conéctate a tu servidor local.
2. Archivo > Abrir Script SQL y selecciona:
   `c:\Users\Janus\inmogestion\.vscode\db\install_backend.sql`
3. Ejecuta el script (botón rayo).

### Opción B: Línea de comandos (CLI)
```powershell
# Ajusta usuario/contraseña/paths a tu entorno
mysql -u root -p < C:\Users\Janus\inmogestion\.vscode\db\install_backend.sql
```

Esto creará la base `inmogestion` con todas las tablas necesarias para el backend (incluye columnas de recuperación de contraseña, contratos, visitas, imágenes, etc.).

> Nota: Si ya tenías una BD previa y solo quieres actualizar, usa `install_full.sql` o consúltame para un script de migración puntual.

---

## 3) Backend (carpeta `.vscode`)

1) Instalar dependencias
```powershell
cd C:\Users\Janus\inmogestion\.vscode
npm install
```

2) Configurar variables de entorno
Crea (o edita) el archivo `.env` en `c:\Users\Janus\inmogestion\.vscode\` con este contenido como base:

```ini
# DB
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TU_PASSWORD
DB_NAME=inmogestion

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=CONTRASENA_DE_APLICACION_16
EMAIL_FROM=InmoGestion <tu_correo@gmail.com>
```

- EMAIL_PASS debe ser una "Contraseña de aplicación" de Google (no tu contraseña normal). Si la necesitas, en Google: Seguridad > Verificación en 2 pasos > Contraseñas de aplicaciones o directamente https://myaccount.google.com/apppasswords

3) Ejecutar el backend

PowerShell puede bloquear scripts npm. Tienes 3 opciones, usa la que prefieras:

- Opción rápida (recomendada):
```powershell
npm run dev
```
- Si ves error de ejecución de scripts (`npm.ps1`):
  - Ejecuta desde Git Bash (no tiene esa restricción), o
  - Usa este atajo que evita la política de PowerShell:
```powershell
node -e "require('child_process').execSync('npm run dev',{stdio:'inherit'})"
```

El backend quedará en `http://localhost:4000`.

> Primer arranque: Puppeteer puede descargar Chromium (para generar PDFs). Tarda 1-3 minutos la primera vez.

---

## 4) Frontend (carpeta `inmogestion-frontend`)

1) Instalar dependencias
```powershell
cd C:\Users\Janus\inmogestion\inmogestion-frontend
npm install
```

2) Ejecutar Vite
```powershell
npm run dev
```

El frontend quedará en `http://localhost:5173`.

> Ya viene configurado el proxy en `vite.config.js` para que todo lo que empiece por `/api` vaya a `http://localhost:4000` y también `/uploads`.

---

## 5) Verificación rápida

1. Abre `http://localhost:5173`
2. Menú Login
3. Usa “¿Olvidaste tu contraseña?” para probar el flujo de recuperación.
   - Si configuraste Gmail real, debe llegarte el correo con el enlace.
   - Si no configuraste email, en modo desarrollo el backend devuelve el token y el frontend lo muestra por consola para poder probar.
4. Explora Propiedades, Dashboard del Cliente, etc.

---

## 6) Solución de problemas comunes

- Error PowerShell: "no se puede cargar npm.ps1"
  - Usa Git Bash, o
  - `node -e "require('child_process').execSync('npm run dev',{stdio:'inherit'})"`

- Error EAUTH (Gmail): credenciales incorrectas
  - Asegúrate de usar una **Contraseña de Aplicación** (no tu contraseña normal) y que la 2FA esté activa.

- Error MySQL 1060 (duplicate column):
  - Ya corriste un ALTER antes. Es normal si reinstalaste. Puedes ignorarlo si el esquema final tiene la columna.

- 404 en `/api/favoritos`:
  - Ya está mitigado: Favoritos usa `localStorage` hasta que exista endpoint real, sin llamadas al backend.

- Descarga de contratos no funciona:
  - Verifica que el backend está encendido y que las rutas de `uploads/` no tengan `/` inicial en BD.

---

## 7) Datos de ejemplo (opcional)

Ya incluido: `SEEDS_MINIMOS.sql` inserta:
 - Admin: usuario = admin / password = Admin123!
 - Agente: usuario = agente / password = Agente123!
 - Cliente: usuario = cliente / password = Cliente123!
 - Localidad + Barrio + 1 Propiedad, 1 interés y 1 visita.

Ejecutar después de crear la base:
```powershell
mysql -u root -p < C:\Users\Janus\inmogestion\inmogestion-frontend\nueva _estructura\SEEDS_MINIMOS.sql
```

Si cambias contraseñas, genera nuevos hashes bcrypt (puedo ayudarte).

---

## 9) Scripts utilitarios (PowerShell)

En esta misma carpeta tienes dos atajos para Windows:

- `RESET_RAPIDO.ps1`:
  - Pide tu contraseña MySQL y ejecuta automáticamente `BASE_DATOS_COMPLETA.sql` + `SEEDS_MINIMOS.sql`.
  - Útil para reiniciar el entorno local en segundos.

- `HEALTH_CHECK.ps1`:
  - Valida que el backend (`http://localhost:4000`) y el frontend (`http://localhost:5173`) respondan.
  - Llama endpoints básicos: `/api/saludo`, `/api/propiedades`, `/api/contratos-documentos`.

Si PowerShell bloquea la ejecución de scripts, puedes ejecutar con política temporal:

```powershell
PowerShell -ExecutionPolicy Bypass -File ".\RESET_RAPIDO.ps1"
PowerShell -ExecutionPolicy Bypass -File ".\HEALTH_CHECK.ps1"
```

---

## 8) Estructura relevante

- Backend: `c:\Users\Janus\inmogestion\.vscode` (Express + rutas + servicios)
- SQL instalación: `c:\Users\Janus\inmogestion\.vscode\db\install_backend.sql`
- Frontend: `c:\Users\Janus\inmogestion\inmogestion-frontend`
- Proxy dev: `inmogestion-frontend/vite.config.js`

---

¿Quieres que agregue datos de prueba (admin/cliente) o un script para reset rápido del entorno?
