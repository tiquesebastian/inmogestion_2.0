# Verificación de Correo (Usuarios y Clientes)

## Migraciones SQL
Ejecutar antes de desplegar la funcionalidad:
```sql
ALTER TABLE usuario 
  ADD COLUMN email_verificado TINYINT(1) DEFAULT 0 AFTER estado,
  ADD COLUMN email_token VARCHAR(64) NULL AFTER email_verificado,
  ADD COLUMN email_token_expires DATETIME NULL AFTER email_token;

ALTER TABLE cliente 
  ADD COLUMN email_verificado TINYINT(1) DEFAULT 0 AFTER estado_cliente,
  ADD COLUMN email_token VARCHAR(64) NULL AFTER email_verificado,
  ADD COLUMN email_token_expires DATETIME NULL AFTER email_token;
```

## Flujo
1. Registro genera `email_token` (64 hex) y expiración (24h).
2. Se envía correo con enlace: `https://TU_FRONTEND/verify?tipo=usuario&token=...` o directamente endpoint backend: `https://TU_BACKEND/api/auth/verificar-email-usuario/TOKEN`.
3. Usuario hace clic -> backend valida token y expiración -> marca `email_verificado = 1`.
4. Token se elimina (`email_token`, `email_token_expires` a NULL).
5. Login puede opcionalmente bloquear acceso si no está verificado.

## Variables .env requeridas
```
SMTP_HOST=smtp.tu_proveedor.com
SMTP_PORT=587
SMTP_USER=usuario_smtp
SMTP_PASS=contraseña_smtp
EMAIL_FROM="InmoGestion <no-reply@inmogestion.com>"
FRONTEND_URL=https://tu-frontend.example
BACKEND_URL=https://tu-backend.example
```

## Endpoints nuevos
- `GET /api/auth/verificar-email-usuario/:token`
- `GET /api/auth/verificar-email-cliente/:token`

## Ejemplo de correo
Asunto: Verifica tu correo en InmoGestión
Cuerpo (HTML):
```
Hola {{nombre}},<br/><br/>
Gracias por registrarte. Verifica tu correo haciendo clic:<br/>
<a href="{{verificationLink}}">Verificar correo</a><br/><br/>
Este enlace expira en 24 horas.<br/><br/>
Equipo InmoGestión
```

## Consideraciones
- No revelar si token existe (en caso de reuso) -> retornar mensaje genérico.
- Expiración renovable manualmente: crear endpoint opcional para reenviar token.
- Agregar índice opcional: `ALTER TABLE usuario ADD INDEX idx_email_token (email_token);`

## Futuras mejoras
- Plantillas HTML avanzadas.
- Reenvío limitado (Rate limiting).
- Lista de supresión para correos rebotados.
