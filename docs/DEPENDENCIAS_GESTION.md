# Actividad Gestión de Dependencias

## Objetivo
Demostrar aislamiento de entornos y reproducibilidad mediante el bloqueo de versiones (pinning) y verificación tras reinstalaciones.

## Alcance
Se trabajó sobre:
1. Backend principal (Express 5.1.0) – versión moderna con características actuales.
2. Entorno demo aislado (`actividad-dependencias/`) – versión legacy Express 4.16.0.

## Pasos Realizados
### 1. Identificación de rangos inseguros
Se detectó `"express": "^5.1.0"` en backend y `"express": "^4.16.0"` en entorno demo. Los rangos con `^` permiten cambios de minor/patch que pueden introducir variaciones.

### 2. Pinning de versiones exactas
- Backend: `"express": "5.1.0"`
- Demo: `"express": "4.16.0"`

Esto garantiza que cualquier instalación posterior obtenga exactamente las mismas versiones.

### 3. Ciclo de reproducibilidad
Backend y demo:
1. Eliminar `node_modules` y `package-lock.json`.
2. Ejecutar `npm install` bajo ExecutionPolicy Bypass (Windows).
3. Verificar con `npm ls express` obteniendo exactamente la versión fijada.

### 4. Servidor de comprobación (demo)
Archivo `index.js` expone `/health` para evidenciar versión embebida en runtime.

### 5. Auditoría rápida
`npm audit` mostró 0 vulnerabilidades en backend y 7 en demo (3 low, 4 high) – se mantiene sin aplicar `--force` para documentar situación real y plan de mejora.

## Evidencias (placeholders para capturas)
- [CAPTURA 1] package.json antes y después del pinning backend.
- [CAPTURA 2] Salida `npm ls express` backend (5.1.0).
- [CAPTURA 3] package.json demo antes y después (caret removido).
- [CAPTURA 4] Salida `npm ls express` demo (4.16.0) instalación inicial.
- [CAPTURA 5] Eliminación y reinstalación demostrando reproducibilidad (misma versión tras segundo `npm ls`).
- [CAPTURA 6] Endpoint `/health` respondiendo versión 4.16.0.

## Riesgos Identificados
- Uso de rangos amplios (`^`) introduce diferencias entre desarrolladores y CI.
- Dependencias legacy (Express 4.x) acumulan vulnerabilidades conocidas.
- Falta de política sistemática de actualización puede generar deuda técnica.

## Recomendaciones
1. Política de Versionado Semántico: pin en producción y CI, permitir rangos minor en ramas experimentales.
2. Automatizar auditoría: agregar script `"audit": "npm audit"` y correrlo en pipeline.
3. Revisión trimestral de upgrades: evaluar changelogs de Express y dependencias clave (bcrypt, nodemailer, puppeteer).
4. Lockfile en control de versiones: ya presente; no editar manualmente.
5. Uso de herramientas complementarias: `npm outdated`, `npm audit --json` para reportes.
6. Separar dependencias dev vs prod: mover herramientas de test/compilación a `devDependencies`.
7. Evaluar migración progresiva de legacy (Express 4.16.0) a 5.x en entornos de prueba controlada.

## Scripts Sugeridos (backend)
```json
{
  "scripts": {
    "start": "node server.js",
    "audit": "npm audit",
    "outdated": "npm outdated"
  }
}
```

## Checklist de Reproducibilidad
- [x] Versiones exactas definidas.
- [x] Lockfile regenerado sin sorpresas.
- [x] Instalación limpia reproduce mismo árbol.
- [x] Verificación runtime (endpoint `/health`).
- [x] Documentación de vulnerabilidades y plan.

## Próximos Pasos
- Integrar scripts sugeridos.
- Ejecutar auditoría automatizada en pipeline CI.
- Definir calendario de actualización (guardar en README o `docs/` como política de mantenimiento).

---
Documento generado para evidenciar práctica de gestión de dependencias dentro del marco de mejora continua (PSP/PPIP).
