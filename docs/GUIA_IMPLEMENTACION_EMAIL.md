# 📧 Guía de Implementación - Verificación de Email

## 📋 Resumen

Esta guía describe cómo implementar y desplegar el sistema de verificación de email en InmoGestión.

---

## 🎯 Paso 1: Ejecutar Migraciones SQL

### Opción A: Desde MySQL Workbench

1. Abre MySQL Workbench
2. Conecta a tu base de datos
3. Abre el archivo: `.vscode/db/add_email_verification.sql`
4. Ejecuta el script completo
5. Verifica que se muestren los mensajes de confirmación

### Opción B: Desde línea de comandos

```bash
# Navega a la carpeta del backend
cd .vscode

# Ejecuta el script SQL
mysql -u root -p inmogestion < db/add_email_verification.sql

# Verificar que las columnas se crearon
mysql -u root -p inmogestion -e "DESCRIBE usuario;"
mysql -u root -p inmogestion -e "DESCRIBE cliente;"
```

### Verificación

Deberías ver estas nuevas columnas en ambas tablas:

```
usuario:
- email_verificado TINYINT(1) DEFAULT 0
- email_token VARCHAR(64) NULL
- email_token_expires DATETIME NULL

cliente:
- email_verificado TINYINT(1) DEFAULT 0
- email_token VARCHAR(64) NULL
- email_token_expires DATETIME NULL
```

---

## 🎯 Paso 2: Configurar Variables de Entorno

### Archivo: `.vscode/.env`

Agrega o actualiza estas variables:

```env
# ==================================
# CONFIGURACIÓN DE EMAIL
# ==================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tiquesebastian53@gmail.com
EMAIL_PASS=zpvifywa sktbwmkl
EMAIL_FROM="InmoGestion <tiquesebastian53@gmail.com>"

# ==================================
# URLS DE LA APLICACIÓN
# ==================================
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000

# Resto de variables existentes...
```

### ⚠️ Importante - Contraseña de Aplicación de Gmail

Si usas Gmail, necesitas crear una **contraseña de aplicación**:

1. Ve a tu cuenta de Google: https://myaccount.google.com/security
2. Activa la verificación en 2 pasos
3. Genera una contraseña de aplicación:
   - Ve a: https://myaccount.google.com/apppasswords
   - Selecciona "Correo" y "Otros"
   - Copia la contraseña generada
   - Úsala en `EMAIL_PASS` (sin espacios)

---

## 🎯 Paso 3: Instalar Dependencia de Nodemailer

```bash
# Navega al backend
cd .vscode

# Instala nodemailer
npm install nodemailer

# Verifica la instalación
npm list nodemailer
```

---

## 🎯 Paso 4: Reiniciar el Servidor Backend

```bash
# Detén el servidor (Ctrl + C)

# Inicia nuevamente
npm run dev

# Deberías ver este mensaje:
# ✅ Servidor de email listo para enviar mensajes
# ✅ Servidor corriendo en http://localhost:4000
```

---

## 🎯 Paso 5: Verificar Endpoints

### Test con PowerShell / curl

```powershell
# Test 1: Verificar que el endpoint existe
Invoke-WebRequest -Uri "http://localhost:4000/api/auth/verificar-email-usuario/test-token" -Method GET

# Deberías ver un error 400 (esperado - token inválido)
```

### Test completo del flujo:

```powershell
# 1. Registrar un nuevo usuario (genera token automáticamente)
$body = @{
    nombre = "Usuario Prueba"
    apellido = "Test"
    correo = "prueba@example.com"
    telefono = "3001234567"
    nombre_usuario = "usuario.test"
    contrasena = "Password123!"
    id_rol = 2
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4000/api/auth/register" -Method POST -Body $body -ContentType "application/json"

# 2. Verificar en la base de datos que se generó el token
# mysql> SELECT email_token, email_token_expires FROM usuario WHERE correo = 'prueba@example.com';

# 3. Reenviar verificación (opcional)
$reenvio = @{ correo = "prueba@example.com" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:4000/api/auth/reenviar-verificacion-usuario" -Method POST -Body $reenvio -ContentType "application/json"
```

---

## 🎯 Paso 6: Verificar Funcionalidad en Frontend

### URLs a probar:

1. **Página de Verificación:**
   ```
   http://localhost:5173/verificar-email?tipo=usuario&token=TOKEN_AQUI
   ```

2. **Componente de Reenvío:**
   - Debería aparecer automáticamente en las páginas de login/registro

### Test Manual:

1. Registra un nuevo usuario/cliente desde el frontend
2. Verifica tu email
3. Haz clic en el enlace de verificación
4. Confirma que te redirige al login
5. Intenta iniciar sesión

---

## 📝 Modificar Registro de Usuarios (Opcional)

Si quieres que el registro automáticamente genere y envíe el token:

### Archivo: `.vscode/src/controllers/auth.controller.js`

Busca la función `register` y agrega:

```javascript
import crypto from 'crypto';
import { enviarEmailVerificacionUsuario } from '../services/emailService.js';

export const register = async (req, res) => {
  // ... código existente ...
  
  try {
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    
    // Generar token de verificación
    const emailToken = crypto.randomBytes(32).toString('hex');
    const emailTokenExpires = new Date();
    emailTokenExpires.setHours(emailTokenExpires.getHours() + 24);

    // Insertar usuario con token
    const query = `
      INSERT INTO usuario (nombre, apellido, correo, telefono, nombre_usuario, contrasena, id_rol, email_token, email_token_expires)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(query, [
      nombre, apellido, correo, telefono, nombre_usuario,
      hashedPassword, id_rol, emailToken, emailTokenExpires
    ]);

    // Enviar email de verificación
    try {
      await enviarEmailVerificacionUsuario({
        nombre,
        correo,
        token: emailToken
      });
    } catch (emailError) {
      console.error('Error enviando email:', emailError);
      // No fallar el registro si falla el email
    }

    res.status(201).json({
      message: 'Usuario registrado. Verifica tu correo electrónico.',
      usuario: { id: result.insertId, nombre, correo }
    });
  } catch (error) {
    // ... manejo de errores ...
  }
};
```

---

## 🧪 Testing

### Test de Email

1. **Verificar servicio de email:**
   ```bash
   node -e "require('dotenv').config(); console.log(process.env.EMAIL_USER);"
   ```

2. **Test de envío manual:**
   
   Crea un archivo `test-email.js`:
   ```javascript
   import { enviarEmailVerificacionUsuario } from './src/services/emailService.js';
   
   enviarEmailVerificacionUsuario({
     nombre: 'Test',
     correo: 'tu-email@gmail.com',
     token: 'test-token-123'
   })
     .then(() => console.log('✅ Email enviado'))
     .catch(err => console.error('❌ Error:', err));
   ```
   
   Ejecuta:
   ```bash
   node test-email.js
   ```

---

## 🔍 Troubleshooting

### Error: "Servidor de email no configurado"

**Causa:** Variables de entorno no cargadas

**Solución:**
```bash
# Verifica que .env existe y tiene las variables
cat .vscode/.env | grep EMAIL

# Reinicia el servidor
```

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Causa:** Contraseña de Gmail incorrecta o no es contraseña de aplicación

**Solución:**
1. Genera una nueva contraseña de aplicación
2. Actualiza `EMAIL_PASS` en `.env`
3. Reinicia el servidor

### Error: "ECONNREFUSED"

**Causa:** No se puede conectar al servidor SMTP

**Solución:**
```env
# Verifica configuración SMTP en .env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### El correo no llega

**Checklist:**
- [ ] Revisa la carpeta de SPAM
- [ ] Verifica que el email destino sea correcto
- [ ] Revisa los logs del servidor backend
- [ ] Verifica que `EMAIL_FROM` tenga formato correcto
- [ ] Prueba con otro proveedor de email

---

## ✅ Verificación Final

Checklist de funcionalidades:

- [ ] Migraciones SQL ejecutadas
- [ ] Variables .env configuradas
- [ ] Nodemailer instalado
- [ ] Servidor backend reiniciado sin errores
- [ ] Mensaje "Servidor de email listo" en consola
- [ ] Endpoint `/verificar-email-usuario/:token` responde
- [ ] Endpoint `/verificar-email-cliente/:token` responde
- [ ] Endpoint `/reenviar-verificacion-usuario` responde
- [ ] Endpoint `/reenviar-verificacion-cliente` responde
- [ ] Página de verificación carga en frontend
- [ ] Se reciben emails de prueba

---

## 📊 Endpoints Disponibles

### Backend (http://localhost:4000/api/auth)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/verificar-email-usuario/:token` | Verifica email de usuario |
| GET | `/verificar-email-cliente/:token` | Verifica email de cliente |
| POST | `/reenviar-verificacion-usuario` | Reenvía email a usuario |
| POST | `/reenviar-verificacion-cliente` | Reenvía email a cliente |

### Frontend (http://localhost:5173)

| Ruta | Descripción |
|------|-------------|
| `/verificar-email?tipo=usuario&token=XXX` | Página de verificación usuario |
| `/verificar-email?tipo=cliente&token=XXX` | Página de verificación cliente |

---

## 🚀 Despliegue a Producción

Cuando despliegues a producción, actualiza:

```env
# Producción
FRONTEND_URL=https://tu-dominio.com
BACKEND_URL=https://api.tu-dominio.com
EMAIL_FROM="InmoGestion <no-reply@tu-dominio.com>"
```

---

## 📧 Soporte

Si tienes problemas:
1. Revisa los logs del servidor: `npm run dev`
2. Verifica la base de datos: `mysql -u root -p inmogestion`
3. Consulta este documento
4. Contacta al equipo de desarrollo

---

**Última actualización:** 24 de noviembre de 2025  
**Versión:** 1.0.0
