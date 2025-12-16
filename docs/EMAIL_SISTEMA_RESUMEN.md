# 📧 Sistema de Emails - Resumen Técnico

## Estado Actual ✅

El sistema de emails está **completamente implementado** en el backend con:

1. **Email de Verificación** - Al registrarse usuario/cliente
2. **Email de Recuperación de Contraseña** - Al solicitar reset
3. **Email de Nuevo Contrato** - Al generar contrato
4. **Email de Nuevo Interés** - Cuando cliente muestra interés en propiedad
5. **Email de Recordatorio de Visita** - 24h antes de visita programada

## ⚠️ Pendiente de Configuración

El servicio está listo pero **necesita credenciales SMTP** en Railway:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tucorreo@gmail.com
EMAIL_PASS=app_password_16_chars
EMAIL_FROM="InmoGestion <tucorreo@gmail.com>"
FRONTEND_URL=https://inmogestion-2-0.vercel.app
BACKEND_URL=https://tu-backend.up.railway.app
```

## 📝 Flujos Implementados

### 1. Registro + Verificación

```
Usuario se registra
    ↓
Backend genera email_token
    ↓
Envía email con enlace: /api/auth/verificar-email-usuario/{token}
    ↓
Usuario hace clic
    ↓
Backend valida token y activa cuenta
    ↓
Usuario puede iniciar sesión
```

**Endpoints**:
- `POST /api/auth/registro` - Registra y envía email
- `POST /api/auth/registro-cliente` - Registra cliente y envía email
- `GET /api/auth/verificar-email-usuario/:token` - Verifica token usuario
- `GET /api/auth/verificar-email-cliente/:token` - Verifica token cliente
- `POST /api/auth/reenviar-verificacion` - Reenvía email si expiró

### 2. Recuperación de Contraseña

```
Usuario olvida contraseña
    ↓
Solicita recuperación en /forgot-password
    ↓
Backend genera reset_token (crypto.randomBytes)
    ↓
Hash SHA256 del token
    ↓
Guarda hash en DB con expiry de 1h
    ↓
Envía email con token original
    ↓
Usuario hace clic y llega a /reset-password?token=XXX
    ↓
Backend valida token (re-hash y compara)
    ↓
Usuario ingresa nueva contraseña
    ↓
Backend actualiza password y borra token
```

**Endpoints**:
- `POST /api/password-recovery/forgot-password-usuario` - Solicita recuperación usuario
- `POST /api/password-recovery/forgot-password-cliente` - Solicita recuperación cliente
- `POST /api/password-recovery/reset-password-usuario` - Resetea password usuario
- `POST /api/password-recovery/reset-password-cliente` - Resetea password cliente

### 3. Otros Emails Automatizados

- **Contrato Generado**: Se envía al generar PDF de contrato
- **Nuevo Interés**: Notifica al agente cuando cliente muestra interés
- **Recordatorio Visita**: Cron job envía 24h antes de visita

## 🧪 Testing

### Endpoint de Prueba

```bash
POST /api/test/email
Content-Type: application/json

{
  "email": "prueba@example.com",
  "tipo": "verificacion"  // o "recuperacion"
}
```

### Script PowerShell

```powershell
.\test-email.ps1
```

El script te guía paso a paso para probar el envío.

## 🔧 Configuración Rápida (5 min)

### Opción A: Gmail

1. https://myaccount.google.com/apppasswords
2. Genera App Password
3. Añade a Railway:
   - `EMAIL_USER=tucorreo@gmail.com`
   - `EMAIL_PASS=abcdefghijklmnop`
4. Railway redeploy automático

### Opción B: Resend (recomendado producción)

1. https://resend.com → Regístrate
2. Copia API Key (empieza con `re_`)
3. Añade a Railway:
   - `EMAIL_HOST=smtp.resend.com`
   - `EMAIL_USER=resend`
   - `EMAIL_PASS=re_tu_api_key`
   - `EMAIL_FROM="InmoGestion <onboarding@resend.dev>"`

## 📄 Archivos Relacionados

- **Servicio**: `.vscode/src/services/email.service.js`
- **Controladores**:
  - `.vscode/src/controllers/passwordRecovery.controller.js`
  - `.vscode/src/controllers/usuario.controller.js`
  - `.vscode/src/controllers/cliente.controller.js`
- **Rutas**:
  - `.vscode/src/routes/passwordRecovery.routes.js`
  - `.vscode/src/routes/emailVerification.routes.js`
  - `.vscode/src/routes/test.routes.js` (pruebas)
- **Frontend**:
  - `inmogestion-frontend/src/pages/RecuperarContrasenaUsuario.jsx`
  - `inmogestion-frontend/src/pages/RecuperarContrasenaCliente.jsx`
  - `inmogestion-frontend/src/pages/ResetPassword.jsx`
  - `inmogestion-frontend/src/pages/ResetPasswordCliente.jsx`
  - `inmogestion-frontend/src/pages/VerificarEmail.jsx`
  - `inmogestion-frontend/src/components/ReenviarVerificacion.jsx`

## 🎯 Checklist de Entrega

- [x] **Backend**: Servicios de email implementados
- [x] **Backend**: Generación y validación de tokens
- [x] **Backend**: Endpoints de recuperación de contraseña
- [x] **Backend**: Endpoints de verificación de email
- [x] **Backend**: Templates HTML profesionales
- [x] **Frontend**: Formularios de recuperación
- [x] **Frontend**: Páginas de reset password
- [x] **Frontend**: Manejo de tokens desde URLs
- [ ] **Pendiente**: Configurar credenciales SMTP en Railway
- [ ] **Pendiente**: Probar flujo completo end-to-end

## 🚀 Para Demo de Mañana

**Instrucciones finales**:

1. **Configura Gmail** (5 min):
   - Genera App Password
   - Añade variables en Railway
   - Espera redeploy (1-2 min)

2. **Prueba el flujo** (5 min):
   - Registra un usuario nuevo
   - Revisa email de verificación
   - Haz clic en el enlace
   - Inicia sesión

3. **Prueba recuperación** (3 min):
   - "Olvidé mi contraseña"
   - Revisa email
   - Resetea contraseña
   - Inicia sesión con nueva contraseña

**Listo para demostrar** ✅

---

Ver [CONFIGURACION_EMAIL.md](../CONFIGURACION_EMAIL.md) para guía paso a paso.
