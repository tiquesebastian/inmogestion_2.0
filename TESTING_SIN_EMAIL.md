# 🧪 Testing Sin Email Externo - Para Mañana

## Problema
Railway bloquea todas las conexiones SMTP salientes (puertos 25, 465, 587).

## Solución para la Demo
Usaremos un endpoint que **genera tokens sin enviar emails**, permitiendo testear el flujo completo:

### 1️⃣ Obtener Token de Verificación

```bash
POST https://inmogestion20-production-fdf7.up.railway.app/api/test/token-directo
Content-Type: application/json

{
  "tipo": "verificacion"
}
```

**Respuesta**:
```json
{
  "success": true,
  "message": "🧪 Token generado para testing",
  "token": "abc123...",
  "tipo": "verificacion",
  "verificarUrl": "https://inmogestion-2-0.vercel.app/verify-email?token=abc123..."
}
```

### 2️⃣ Copiar y Pegar la URL
Copia el valor de `verificarUrl` y abre en el navegador. Esto verificará tu email.

### 3️⃣ Obtener Token de Recuperación

```bash
POST https://inmogestion20-production-fdf7.up.railway.app/api/test/token-directo
Content-Type: application/json

{
  "tipo": "recuperacion"
}
```

### 4️⃣ Resetear Contraseña
Copia la URL de recuperación y abre en navegador.

---

## ✅ Flujo Completo para Demo

```
1. Usuario se registra → /registro
2. Obtener token: POST /api/test/token-directo?tipo=verificacion
3. Abrir URL de verificación en navegador
4. ✅ Email verificado
5. Ir a "Olvidé contraseña" → /forgot-password
6. Obtener token: POST /api/test/token-directo?tipo=recuperacion
7. Abrir URL de reseteo en navegador
8. ✅ Contraseña reseteada
9. Login con nueva contraseña
```

---

## 🎯 Usando cURL o Postman

### En Postman:
1. New → Request
2. Method: POST
3. URL: `https://inmogestion20-production-fdf7.up.railway.app/api/test/token-directo`
4. Body → JSON → `{ "tipo": "verificacion" }`
5. Send
6. Copia la URL del response y abre en navegador

### En Terminal (PowerShell):
```powershell
$body = @{ tipo='verificacion' } | ConvertTo-Json
$resp = Invoke-RestMethod -Uri "https://inmogestion20-production-fdf7.up.railway.app/api/test/token-directo" `
  -Method POST -Body $body -ContentType "application/json"
Write-Host $resp.verificarUrl
```

---

## 📝 Nota para Entrega

**Para clientes reales**, cuando tengan acceso a servicios de email (SendGrid, AWS SES, etc.):
1. Cambiar `EMAIL_PROVIDER` a valor diferente
2. Actualizar credenciales SMTP
3. Los flujos de email funcionarán automáticamente

El sistema está **completamente implementado**, solo está bloqueado por limitaciones de infraestructura (Railway plan gratuito).

