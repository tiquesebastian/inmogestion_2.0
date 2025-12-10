# Hashing de Tokens de Seguridad

## 📋 Resumen

A partir del 24 de noviembre de 2025, todos los tokens de verificación de email y recuperación de contraseña se almacenan hasheados con SHA256 en la base de datos para mejorar la seguridad.

## 🔐 ¿Por qué hashear tokens?

### Problema Anterior
- Los tokens se almacenaban en **texto plano** en la base de datos
- Si un atacante obtiene acceso a la BD, puede:
  - Verificar cualquier cuenta usando `email_token`
  - Restablecer cualquier contraseña usando `reset_token`
  - Comprometer cuentas sin conocer las contraseñas

### Solución Implementada
- Los tokens se **hashean con SHA256** antes de almacenarlos
- El token original se envía por email (único canal seguro)
- La BD solo contiene el hash, inútil para un atacante
- Al verificar, se hashea el token recibido y se compara con el hash almacenado

## 🔄 Flujo de Verificación de Email

### Registro
```javascript
// 1. Generar token aleatorio (64 caracteres hex)
const token = crypto.randomBytes(32).toString('hex');

// 2. Hashear token con SHA256
const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

// 3. Guardar solo el hash en BD
UPDATE usuario SET email_token = tokenHash, email_token_expires = NOW() + INTERVAL 24 HOUR

// 4. Enviar token original por email
enviarEmail({ token: token, ... })
```

### Verificación
```javascript
// 1. Usuario hace clic en link con token
GET /verificar-email-usuario/:token

// 2. Backend hashea el token recibido
const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

// 3. Buscar en BD por hash
SELECT * FROM usuario WHERE email_token = tokenHash AND email_token_expires > NOW()

// 4. Si coincide, marcar como verificado
UPDATE usuario SET email_verificado = 1, email_token = NULL
```

## 🔄 Flujo de Recuperación de Contraseña

### Solicitar Reset
```javascript
// 1. Generar token aleatorio
const resetToken = crypto.randomBytes(32).toString('hex');

// 2. Hashear con SHA256
const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

// 3. Guardar hash en BD
UPDATE usuario SET reset_token = resetTokenHash, reset_token_expires = NOW() + INTERVAL 1 HOUR

// 4. Enviar token original por email
enviarEmailRecuperacion({ resetToken: resetToken, ... })
```

### Restablecer Contraseña
```javascript
// 1. Usuario envía token desde formulario
POST /password-recovery/reset-usuario { token, newPassword }

// 2. Hashear token recibido
const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

// 3. Buscar usuario con hash válido
SELECT * FROM usuario WHERE reset_token = tokenHash AND reset_token_expires > NOW()

// 4. Si coincide, actualizar contraseña
UPDATE usuario SET contrasena = hashedPassword, reset_token = NULL
```

## 📂 Archivos Modificados

### Backend Controllers
- ✅ `emailVerification.controller.js` - Verificación de email (usuario/cliente)
- ✅ `passwordRecovery.controller.js` - Recuperación de contraseña (usuario/cliente)
- ✅ `usuario.controller.js` - Registro de usuario
- ✅ `authCliente.controller.js` - Registro de cliente

### Cambios Específicos

#### emailVerification.controller.js
```javascript
// Nueva función helper
const hashearToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Aplicada en:
- reenviarVerificacionUsuario()
- reenviarVerificacionCliente()
- verificarEmailUsuario()
- verificarEmailCliente()
```

#### passwordRecovery.controller.js
```javascript
// Aplicado en:
- solicitarRecuperacionUsuario()
- solicitarRecuperacionCliente()
- restablecerPasswordUsuario()
- restablecerPasswordCliente()
```

#### usuario.controller.js y authCliente.controller.js
```javascript
// En función register/registroCliente:
const emailTokenHash = crypto.createHash('sha256').update(emailToken).digest('hex');
await db.query(
  "UPDATE usuario SET email_token = ?, email_token_expires = ?, email_verificado = 0",
  [emailTokenHash, expires, userId]
);
```

## 🔒 Propiedades de Seguridad

### SHA256
- **Determinista**: Mismo input → mismo output
- **Unidireccional**: Imposible revertir hash → token original
- **Rápido**: Validación eficiente en cada request
- **Resistente a colisiones**: Probabilidad ínfima de dos tokens con mismo hash

### Longitud del Token
- **32 bytes** de entropía (crypto.randomBytes)
- **64 caracteres** hexadecimales
- **2^256 combinaciones posibles** (prácticamente imposible de adivinar)

### Expiración
- Email verification: **24 horas**
- Password reset: **1 hora**
- Tokens expirados se eliminan al verificar/restablecer

## ⚠️ Consideraciones de Migración

### Tokens Existentes en BD
Si ejecutaste el sistema antes del hashing:
- Los tokens antiguos en BD son **texto plano**
- Al intentar verificar, se buscarán como hash → **fallarán**
- **Solución**: Pedir reenvío de verificación (genera nuevo token hasheado)

### Regenerar Tokens
```sql
-- Limpiar tokens antiguos (opcional)
UPDATE usuario SET email_token = NULL, email_token_expires = NULL WHERE email_verificado = 0;
UPDATE cliente SET email_token = NULL, email_token_expires = NULL WHERE email_verificado = 0;
UPDATE usuario SET reset_token = NULL, reset_token_expires = NULL;
UPDATE cliente SET reset_token = NULL, reset_token_expires = NULL;
```

Luego los usuarios pueden solicitar nuevos tokens que ya estarán hasheados.

## 🧪 Testing

### Modo Desarrollo
El controlador de password recovery expone el token en la respuesta JSON cuando:
```javascript
const isDev = process.env.NODE_ENV === 'development' || !process.env.EMAIL_USER;
```

Ejemplo de respuesta en desarrollo:
```json
{
  "message": "Si el email existe, recibirás un correo con instrucciones",
  "token": "abc123...token original...",
  "resetUrl": "http://localhost:5173/reset-password?token=abc123...",
  "nota": "Token visible solo en desarrollo"
}
```

### Verificar Hash Manualmente
```javascript
// Node.js REPL o script
const crypto = require('crypto');
const token = 'abc123...'; // Token del email
const hash = crypto.createHash('sha256').update(token).digest('hex');
console.log(hash);

// Comparar con valor en BD
SELECT email_token FROM usuario WHERE correo = 'test@example.com';
```

## 📊 Impacto en Rendimiento

- **SHA256** es extremadamente rápido (~1-2 microsegundos por hash)
- **Sin impacto perceptible** en tiempo de respuesta
- **Ganancia de seguridad** significativa sin costo de performance

## 🛡️ Mejoras Futuras Recomendadas

### 1. Rate Limiting en Reenvío
```javascript
// Limitar reenvíos de verificación por IP/email
app.post('/reenviar-verificacion', rateLimitReenvio, ...)
```

### 2. Auditoría de Tokens
```javascript
// Registrar intentos de verificación fallidos
INSERT INTO auditoria (accion, entidad, detalle) 
VALUES ('token_invalido', 'email_verification', JSON_OBJECT('ip', ?, 'token_hash', ?))
```

### 3. Invalidación Activa
```javascript
// Al generar nuevo token, invalidar anteriores
UPDATE usuario SET email_token = NULL WHERE id_usuario = ? AND email_token IS NOT NULL;
// Luego insertar el nuevo
```

### 4. Pepper Adicional (Opcional)
```javascript
// Agregar secret del servidor al hash (pepper)
const tokenHash = crypto.createHash('sha256')
  .update(token + process.env.TOKEN_PEPPER)
  .digest('hex');
```
⚠️ Requiere configurar `TOKEN_PEPPER` en `.env` y regenerar todos los tokens.

## 📚 Referencias

- [OWASP: Password Reset Tokens](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)
- [SHA-256 Specification](https://en.wikipedia.org/wiki/SHA-2)

---

**Fecha de Implementación**: 24 de noviembre de 2025  
**Autor**: GitHub Copilot  
**Estado**: ✅ Implementado y Documentado
