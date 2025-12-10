# Sistema de Auditoría - InmoGestión

## 📋 Resumen

Sistema completo de auditoría para registrar todas las acciones críticas de seguridad y trazabilidad en InmoGestión.

## 🗂️ Estructura de Tabla de Auditoría

### Esquema Base (schema.sql)
```sql
CREATE TABLE auditoria (
    id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
    tabla_afectada VARCHAR(50) NOT NULL,
    accion VARCHAR(20) NOT NULL,
    descripcion TEXT,
    usuario_accion VARCHAR(100),
    fecha_accion DATETIME DEFAULT CURRENT_TIMESTAMP,
    detalle_json JSON NULL  -- Columna agregada por migración
);
```

### Índices para Performance
- `idx_tabla_accion`: Búsqueda por tabla y tipo de acción
- `idx_fecha_accion`: Consultas temporales (últimas 24h, semana, mes)
- `idx_usuario_accion`: Auditoría por usuario específico

## 🔧 Componentes Implementados

### 1. Middleware de Auditoría (`audit.middleware.js`)

#### Función Principal: `registrarAuditoria()`
```javascript
await registrarAuditoria({
  tabla: 'usuario',
  accion: 'LOGIN',
  descripcion: 'Inicio de sesión exitoso',
  usuarioAccion: 'admin@inmogestion.com',
  detalles: { ip: '192.168.1.1', exitoso: true },
  req
});
```

**Campos JSON guardados automáticamente:**
- `ip`: Dirección IP del cliente
- `userAgent`: Navegador y SO del usuario
- `timestamp`: Momento exacto de la acción
- Cualquier detalle adicional pasado

#### Helpers Simplificados: `audit.*`
```javascript
// Login exitoso
await audit.login('user@example.com', req, true);

// Login fallido
await audit.login('user@example.com', req, false);

// Registro
await audit.register('user@example.com', 'usuario', req);

// Verificación de email
await audit.verifyEmail('user@example.com', 'usuario', req);

// Recuperación de contraseña (solicitud)
await audit.passwordReset('user@example.com', 'usuario', req, 'request');

// Recuperación de contraseña (reset exitoso)
await audit.passwordReset('user@example.com', 'usuario', req, 'reset');

// CRUD genérico
await audit.create('admin@inmogestion.com', 'propiedad', req);
await audit.update('admin@inmogestion.com', 'propiedad', req, 123);
await audit.delete('admin@inmogestion.com', 'contrato', req, 456);
```

#### Middleware Automático (Uso Futuro)
```javascript
// En routes:
router.post('/propiedades', 
  authenticate,
  auditMiddleware('propiedad', 'CREATE'),
  crearPropiedad
);
```
Audita automáticamente después de respuestas exitosas (2xx).

### 2. Integración en Controladores

#### `emailVerification.controller.js`
✅ Audita:
- Reenvío de verificación (usuario y cliente)
- Verificación exitosa de email

#### `usuario.controller.js`
✅ Audita:
- Registro de usuario
- Login exitoso
- Login fallido (404, 401)

#### `authCliente.controller.js`
✅ Audita:
- Registro de cliente
- Login exitoso
- Login fallido

#### `passwordRecovery.controller.js`
✅ Audita:
- Solicitud de recuperación (usuario y cliente)
- Restablecimiento exitoso de contraseña

## 🛡️ Seguridad y Privacidad

### Sanitización Automática
El middleware **redacta** información sensible antes de guardarla:

**Campos Redactados en Payload:**
- `contrasena`, `password`, `newPassword`, `oldPassword`
- `token`, `reset_token`, `email_token`
- `clave_maestra`, `masterKey`

**Ejemplo:**
```json
{
  "correo": "user@example.com",
  "contrasena": "[REDACTADO]",
  "nombre": "Juan Pérez"
}
```

**Tokens Redactados en Respuesta:**
```json
{
  "message": "Login exitoso",
  "token": "[REDACTADO]",
  "success": true
}
```

### No Falla Operación Principal
Si la auditoría falla, **no afecta** la operación:
```javascript
await audit.login(correo, req).catch(err => 
  console.error('Error auditando:', err)
);
```
Solo registra el error en consola.

## 📊 Tipos de Acciones Auditadas

| Acción | Descripción | Tabla |
|--------|-------------|-------|
| `REGISTER` | Registro de nuevo usuario/cliente | usuario, cliente |
| `LOGIN` | Inicio de sesión exitoso | usuario, cliente |
| `LOGIN_FAILED` | Intento de login fallido | usuario, cliente |
| `VERIFY_EMAIL` | Verificación/reenvío de email | usuario, cliente |
| `PASSWORD_RESET_REQUEST` | Solicitud de recuperación | usuario, cliente |
| `PASSWORD_RESET` | Restablecimiento exitoso | usuario, cliente |
| `CREATE` | Creación de registro | cualquiera |
| `UPDATE` | Actualización de registro | cualquiera |
| `DELETE` | Eliminación de registro | cualquiera |
| `VIEW` | Consulta de datos sensibles | cualquiera |
| `UPLOAD_DOCUMENT` | Subida de documento | documentos |
| `DOWNLOAD_DOCUMENT` | Descarga de documento | documentos |

## 📈 Consultas Útiles de Auditoría

### Últimos 100 eventos
```sql
SELECT 
  id_auditoria,
  tabla_afectada,
  accion,
  usuario_accion,
  fecha_accion,
  JSON_EXTRACT(detalle_json, '$.ip') AS ip
FROM auditoria
ORDER BY fecha_accion DESC
LIMIT 100;
```

### Intentos de login fallidos (últimas 24h)
```sql
SELECT 
  usuario_accion,
  COUNT(*) AS intentos,
  JSON_EXTRACT(detalle_json, '$.ip') AS ip,
  MAX(fecha_accion) AS ultimo_intento
FROM auditoria
WHERE 
  accion = 'LOGIN_FAILED'
  AND fecha_accion > NOW() - INTERVAL 24 HOUR
GROUP BY usuario_accion, JSON_EXTRACT(detalle_json, '$.ip')
HAVING intentos > 3
ORDER BY intentos DESC;
```

### Actividad de un usuario específico
```sql
SELECT 
  accion,
  tabla_afectada,
  descripcion,
  fecha_accion,
  detalle_json
FROM auditoria
WHERE usuario_accion = 'admin@inmogestion.com'
ORDER BY fecha_accion DESC
LIMIT 50;
```

### Cambios en una tabla específica (última semana)
```sql
SELECT 
  accion,
  usuario_accion,
  descripcion,
  fecha_accion,
  JSON_EXTRACT(detalle_json, '$.id') AS registro_afectado
FROM auditoria
WHERE 
  tabla_afectada = 'propiedad'
  AND accion IN ('CREATE', 'UPDATE', 'DELETE')
  AND fecha_accion > NOW() - INTERVAL 7 DAY
ORDER BY fecha_accion DESC;
```

### IPs sospechosas (múltiples usuarios desde misma IP)
```sql
SELECT 
  JSON_EXTRACT(detalle_json, '$.ip') AS ip,
  COUNT(DISTINCT usuario_accion) AS usuarios_distintos,
  COUNT(*) AS acciones_totales,
  GROUP_CONCAT(DISTINCT usuario_accion) AS usuarios
FROM auditoria
WHERE fecha_accion > NOW() - INTERVAL 1 HOUR
GROUP BY JSON_EXTRACT(detalle_json, '$.ip')
HAVING usuarios_distintos > 5
ORDER BY usuarios_distintos DESC;
```

### Verificaciones de email por día
```sql
SELECT 
  DATE(fecha_accion) AS fecha,
  tabla_afectada,
  COUNT(*) AS verificaciones
FROM auditoria
WHERE accion = 'VERIFY_EMAIL'
  AND fecha_accion > NOW() - INTERVAL 30 DAY
GROUP BY DATE(fecha_accion), tabla_afectada
ORDER BY fecha DESC;
```

## 🔄 Migración

### Ejecutar Migración
```bash
# Desde MySQL CLI o Workbench:
mysql -u root -p inmogestion < .vscode/db/add_audit_detalle_json.sql
```

### Verificar
```sql
USE inmogestion;

-- Ver estructura de tabla
DESCRIBE auditoria;

-- Ver índices
SHOW INDEX FROM auditoria;

-- Verificar que detalle_json acepte JSON
SELECT COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'auditoria' AND COLUMN_NAME = 'detalle_json';
```

## 📦 Mantenimiento

### Limpieza de Registros Antiguos
Mantener solo últimos 90 días (ejecutar periódicamente):
```sql
DELETE FROM auditoria 
WHERE fecha_accion < NOW() - INTERVAL 90 DAY;
```

### Archivar Registros Antiguos
```sql
-- Crear tabla de archivo
CREATE TABLE auditoria_archivo LIKE auditoria;

-- Mover registros antiguos
INSERT INTO auditoria_archivo
SELECT * FROM auditoria
WHERE fecha_accion < NOW() - INTERVAL 90 DAY;

-- Eliminar de tabla activa
DELETE FROM auditoria 
WHERE fecha_accion < NOW() - INTERVAL 90 DAY;
```

### Monitoreo de Tamaño
```sql
SELECT 
  table_name AS 'Tabla',
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Tamaño (MB)',
  table_rows AS 'Filas'
FROM information_schema.TABLES
WHERE table_schema = 'inmogestion'
  AND table_name = 'auditoria';
```

## 🚀 Extensiones Futuras

### 1. Dashboard de Auditoría (Admin)
Crear ruta `/admin/auditoria` con:
- Gráficos de actividad por día/semana
- Top usuarios más activos
- Alertas de actividad sospechosa
- Exportar a CSV/PDF

### 2. Alertas en Tiempo Real
```javascript
// Detectar múltiples logins fallidos
if (intentosFallidos >= 5) {
  await enviarAlertaAdmin({
    tipo: 'SEGURIDAD',
    mensaje: `${usuario} tiene ${intentosFallidos} intentos fallidos`,
    ip: req.ip
  });
}
```

### 3. Auditoría Detallada de Cambios
Guardar `antes` y `después` en JSON:
```javascript
await audit.update(admin, 'propiedad', req, id, {
  antes: { precio: 100000, estado: 'Disponible' },
  despues: { precio: 95000, estado: 'Reservada' }
});
```

### 4. Integración con SIEM
Exportar logs a sistemas de seguridad externos (Splunk, ELK, etc.).

## ✅ Checklist de Implementación

- [x] Crear middleware de auditoría
- [x] Migración SQL (detalle_json + índices)
- [x] Integrar en emailVerification.controller
- [x] Integrar en usuario.controller (login/register)
- [x] Integrar en authCliente.controller
- [x] Integrar en passwordRecovery.controller
- [ ] Ejecutar migración en base de datos
- [ ] Probar registro de auditoría en desarrollo
- [ ] Crear endpoint GET /admin/auditoria (listar)
- [ ] Implementar dashboard visual
- [ ] Configurar limpieza automática (cron job)
- [ ] Documentar para equipo de desarrollo

---

**Fecha de Implementación**: 24 de noviembre de 2025  
**Autor**: GitHub Copilot  
**Estado**: ✅ Código Implementado | ⏳ Migración Pendiente
