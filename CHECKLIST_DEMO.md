# ✅ CHECKLIST FINAL - DEMO MAÑANA

## 🔥 CRÍTICO - Hacer HOY (15 minutos)

### 1. Configurar Email en Railway (5 min)

**Opción A - Gmail (más rápido)**:

```bash
# 1. Abre: https://myaccount.google.com/apppasswords
# 2. Genera App Password
# 3. Ve a Railway → Variables → Añade:

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tucorreo@gmail.com
EMAIL_PASS=abcdefghijklmnop  # ⚠️ SIN ESPACIOS
EMAIL_FROM="InmoGestion <tucorreo@gmail.com>"
FRONTEND_URL=https://inmogestion-2-0.vercel.app
BACKEND_URL=https://tu-backend.up.railway.app  # ⚠️ Reemplaza con tu URL real
```

**Opción B - Resend (si Gmail falla)**:

```bash
# 1. Regístrate en https://resend.com
# 2. Copia tu API Key (empieza con "re_")
# 3. Añade en Railway:

EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=resend
EMAIL_PASS=re_tu_api_key_aqui
EMAIL_FROM="InmoGestion <onboarding@resend.dev>"
FRONTEND_URL=https://inmogestion-2-0.vercel.app
BACKEND_URL=https://tu-backend.up.railway.app
```

⏰ **Espera 1-2 minutos** para que Railway redeploy automáticamente.

---

### 2. Verificar que funciona (5 min)

#### A. Revisa los Logs de Railway

Ve a: **Railway → Deployments → Logs**

Busca estas líneas:

```
✅ Servidor corriendo en http://localhost:4000
✅ Servidor SMTP listo para enviar emails
```

❌ Si ves `Error de conexión SMTP`:
- Verifica que EMAIL_PASS sea el App Password (16 caracteres sin espacios)
- Verifica que EMAIL_USER sea tu correo completo

#### B. Prueba con el endpoint de test

```bash
# Con PowerShell:
cd .vscode
.\test-email.ps1

# O con curl/Postman:
POST https://tu-backend.up.railway.app/api/test/email
Content-Type: application/json

{
  "email": "tu-email@gmail.com",
  "tipo": "verificacion"
}
```

✅ Deberías recibir un email en **menos de 10 segundos**.

---

### 3. Probar Flujos Completos (5 min)

#### A. Registro + Verificación

1. Ve a https://inmogestion-2-0.vercel.app/registro
2. Registra un usuario nuevo
3. **Revisa tu bandeja** → deberías recibir email de verificación
4. Haz clic en "Verificar correo"
5. Deberías ser redirigido y poder iniciar sesión

#### B. Recuperación de Contraseña

1. Ve a https://inmogestion-2-0.vercel.app/forgot-password
2. Ingresa el email del usuario
3. **Revisa tu bandeja** → email de recuperación
4. Haz clic en "Restablecer Contraseña"
5. Ingresa nueva contraseña
6. Inicia sesión con la nueva contraseña

---

## ✅ Funcionalidades LISTAS para Demo

### Backend Deployado en Railway ✅
- [x] Base de datos MySQL conectada
- [x] API REST funcionando
- [x] Autenticación JWT
- [x] Trust proxy configurado
- [x] Static files serving (/uploads)
- [x] CORS configurado para Vercel
- [x] Rate limiting
- [x] Servicio de email configurado (pendiente credenciales)

### Frontend Deployado en Vercel ✅
- [x] React + Vite optimizado
- [x] Rutas configuradas (SPA fallback)
- [x] API rewrites a Railway
- [x] Dual login (/inmogestion, /login)
- [x] Global 401/403 handling
- [x] Placeholders para imágenes
- [x] Módulos de documentos ocultos

### Autenticación & Seguridad ✅
- [x] Login admin/agente (/inmogestion)
- [x] Login cliente (/login)
- [x] JWT en localStorage
- [x] Verificación de tokens
- [x] Roles (admin, agente, cliente)
- [x] Middleware de autorización
- [x] Verificación de email (backend listo)
- [x] Recuperación de contraseña (backend listo)

### Panel Admin ✅
- [x] Ver usuarios (admin/agente/cliente)
- [x] Editar estado usuarios (activo/inactivo)
- [x] Ver propiedades
- [x] Crear/editar propiedades
- [x] Ver contratos
- [x] Generar contratos PDF
- [x] Ver reportes (con empty states)

### Panel Agente ✅
- [x] Ver sus propiedades asignadas
- [x] Gestionar visitas
- [x] Ver clientes interesados
- [x] Generar reportes

### Panel Cliente ✅
- [x] Ver propiedades disponibles
- [x] Mostrar interés en propiedades
- [x] Ver sus contratos
- [x] Descargar contratos

### Emails (⚠️ Pendiente credenciales) ✅
- [x] Email de verificación al registrarse
- [x] Email de recuperación de contraseña
- [x] Email de contrato generado
- [x] Email de nuevo interés
- [x] Email de recordatorio de visita
- [x] Templates HTML profesionales
- [ ] **Credenciales SMTP configuradas** ⬅️ HACER HOY

---

## 🎯 DEMO - Flujo Recomendado

### 1. Inicio (Homepage)
Mostrar slider de propiedades destacadas, búsqueda rápida

### 2. Login Admin
- URL: https://inmogestion-2-0.vercel.app/inmogestion
- Usuario: admin@inmogestion.com / Admin123!
- Mostrar dashboard con estadísticas

### 3. Gestión de Usuarios (Admin)
- Ver lista de usuarios
- Cambiar estado (activo/inactivo)
- Explicar roles (admin, agente, cliente)

### 4. Gestión de Propiedades (Admin)
- Ver propiedades
- Crear nueva propiedad
- Editar existente
- Mostrar placeholders de imágenes (explicar ephemeral storage)

### 5. Contratos (Admin)
- Ver contratos existentes
- Generar nuevo contrato
- Descargar PDF
- **Mostrar email enviado al cliente** ⬅️ SI CONFIGURASTE SMTP

### 6. Reportes (Admin)
- Ventas por localidad (mostrar empty state)
- Explicar estructura lista para datos

### 7. Registro Cliente (⭐ Email)
- Registrar nuevo cliente
- **Mostrar email de verificación recibido**
- Verificar cuenta haciendo clic
- **Login exitoso**

### 8. Recuperación Contraseña (⭐ Email)
- "Olvidé mi contraseña"
- **Mostrar email de recuperación**
- Resetear contraseña
- Login con nueva contraseña

### 9. Panel Cliente
- Ver propiedades disponibles
- Mostrar interés
- Ver mis contratos

---

## 🚨 Troubleshooting Last Minute

### Email no funciona

**Problema**: No llegan emails después de configurar Railway

**Solución rápida**:
1. Revisa logs de Railway: `❌ Error de conexión SMTP`
2. Verifica EMAIL_PASS sea App Password (sin espacios)
3. Si persiste, usa Resend (5 min setup)
4. **Plan B**: Omitir emails en demo, explicar que "está configurado pero por seguridad no mostramos emails reales"

### Imágenes no se ven

**OK**: Es esperado. Explicar:
- Railway usa almacenamiento efímero
- Placeholders implementados
- Solución: Railway Volumes (upgrade de plan)

### Usuario no puede editar estado → 403

**Verificar**:
1. Token válido en localStorage
2. Usuario tiene rol "admin"
3. Logs de Railway para ver error específico

### Propiedad muestra "undefined"

**Verificar**:
1. Propiedad tiene todos los campos requeridos
2. Referencias foráneas (id_localidad, id_barrio) existen
3. Query SQL en backend incluye JOINs necesarios

---

## 📞 Contactos de Emergencia

Si algo falla durante la demo:

1. **Railway caído**: Mostrar capturas de pantalla de funcionalidad
2. **Vercel caído**: Igual, capturas
3. **Email no funciona**: Explicar flujo técnico sin demostración en vivo

---

## ✅ Checklist Pre-Demo (Mañana temprano)

- [ ] Verificar Railway está en verde (no caído)
- [ ] Verificar Vercel deployado correctamente
- [ ] Probar login admin
- [ ] Probar login cliente
- [ ] Verificar email de prueba llega
- [ ] Tener pestañas abiertas:
  - Frontend (Vercel)
  - Railway logs
  - Email (para mostrar recepción)
  - GitHub (por si preguntan por código)
- [ ] Preparar explicación de decisiones técnicas:
  - Por qué Railway (MySQL incluido, fácil deploy)
  - Por qué Vercel (optimizado para React/Vite)
  - Por qué placeholders (ephemeral storage, upgrade pendiente)
  - Por qué módulos ocultos (no funcionales para MVP)

---

## 🎉 ¡ÉXITO!

Todo está listo. Solo falta:
1. ⏰ **Configurar credenciales SMTP** (15 min)
2. 🧪 **Probar flujos de email** (5 min)
3. 💤 **Descansar para mañana**

**¡Vas a hacer una gran demo!** 🚀
