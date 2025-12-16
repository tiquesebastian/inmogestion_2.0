# 📧 Configuración de Email para InmoGestion

## 🚀 Opción 1: Gmail (5 minutos) - RECOMENDADO PARA DEMO

### Paso 1: Generar App Password en Gmail

1. **Ve a**: https://myaccount.google.com/apppasswords
2. **Selecciona**:
   - Aplicación: "Mail"
   - Dispositivo: "Windows Computer"
3. **Genera** y copia la contraseña de 16 caracteres (ej: `abcd efgh ijkl mnop`)

### Paso 2: Configurar Variables en Railway

Ve a tu proyecto en Railway → **Variables** y añade:

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tucorreo@gmail.com
EMAIL_PASS=abcdefghijklmnop
EMAIL_FROM="InmoGestion <tucorreo@gmail.com>"
FRONTEND_URL=https://inmogestion-2-0.vercel.app
BACKEND_URL=https://tu-backend.up.railway.app
```

**⚠️ IMPORTANTE**: 
- Reemplaza `abcdefghijklmnop` con tu App Password **SIN espacios**
- Reemplaza las URLs con las reales de tu deployment

### Paso 3: Redeploy

Railway se actualizará automáticamente. Espera 1-2 minutos.

### Paso 4: Probar Email

Haz una petición POST:

```bash
# Prueba de verificación
POST https://tu-backend.up.railway.app/api/test/email
Content-Type: application/json

{
  "email": "tu-email-prueba@gmail.com",
  "tipo": "verificacion"
}

# Prueba de recuperación
POST https://tu-backend.up.railway.app/api/test/email
Content-Type: application/json

{
  "email": "tu-email-prueba@gmail.com",
  "tipo": "recuperacion"
}
```

---

## 🌟 Opción 2: Resend (Más confiable para producción)

Si Gmail no funciona o Railway bloquea SMTP, usa **Resend**:

### Paso 1: Crear cuenta

1. Ve a https://resend.com
2. Regístrate gratis (100 emails/día)
3. Verifica tu email

### Paso 2: Obtener API Key

1. En el dashboard, ve a **API Keys**
2. Crea una nueva key
3. Cópiala (empieza con `re_...`)

### Paso 3: Configurar en Railway

```bash
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=resend
EMAIL_PASS=re_tu_api_key_aqui
EMAIL_FROM="InmoGestion <onboarding@resend.dev>"
```

**Nota**: Usa `onboarding@resend.dev` para pruebas. Para producción, verifica tu dominio.

---

## ✅ Verificar que funciona

### 1. Logs de Railway

Ve a **Deployments → Logs** y busca:

```
✅ Servidor corriendo en http://localhost:4000
✅ Servidor SMTP listo para enviar emails
```

Si ves:
```
❌ Error de conexión SMTP: ...
```

Revisa EMAIL_USER, EMAIL_PASS y que sean correctos.

### 2. Flujos de Email

#### A. Registro de Usuario → Email de Verificación

1. Usuario se registra en `/registro` o `/registro-cliente`
2. Se envía email con token de verificación
3. Usuario hace clic en el enlace
4. Backend valida el token y activa la cuenta
5. Usuario puede iniciar sesión

#### B. Recuperación de Contraseña

1. Usuario va a "¿Olvidaste tu contraseña?"
2. Ingresa su email
3. Recibe email con enlace de recuperación
4. Hace clic (válido por 1 hora)
5. Resetea su contraseña
6. Puede iniciar sesión con la nueva

#### C. Email de Bienvenida (opcional)

Actualmente enviado junto con la verificación. Se puede separar.

---

## 🔧 Troubleshooting

### Error: "ETIMEDOUT"

**Causa**: Railway no puede conectar al SMTP.

**Solución**:
1. Verifica que el App Password sea correcto
2. Prueba con puerto 465 y `EMAIL_SECURE=true`
3. Si persiste, usa Resend

### Error: "Invalid login"

**Causa**: Credenciales incorrectas o no es un App Password.

**Solución**:
1. Verifica que `EMAIL_PASS` sea el App Password (16 caracteres sin espacios)
2. No uses tu contraseña normal de Gmail

### Error: "Daily sending quota exceeded"

**Causa**: Gmail limita emails gratis.

**Solución**: Usa Resend (más generoso).

### Emails no llegan

**Solución**:
1. Revisa la carpeta de Spam
2. Verifica que `EMAIL_FROM` use el mismo email que `EMAIL_USER`
3. Revisa los logs de Railway para ver si hubo errores

---

## 📝 Checklist Final

- [ ] App Password generado en Gmail
- [ ] Variables de entorno configuradas en Railway
- [ ] Railway redesplegado (logs muestran "✅ Servidor SMTP listo")
- [ ] Email de prueba enviado correctamente (`/api/test/email`)
- [ ] Registro de usuario envía email de verificación
- [ ] Recuperación de contraseña envía email
- [ ] Enlaces en emails funcionan correctamente
- [ ] URLs apuntan a producción (no localhost)

---

## 🎯 Para mañana

**Requisitos obligatorios cumplidos**:
- ✅ Verificación de email en registro
- ✅ Recuperación de contraseña por email
- ✅ Emails profesionales con diseño HTML

**Listo para demo** 🚀
