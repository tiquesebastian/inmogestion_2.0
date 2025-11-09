# Módulo de Visitas - InmoGestión

## 📅 Resumen General

Sistema completo de gestión de visitas a propiedades que permite a agentes y administradores programar citas con clientes, mientras que los clientes pueden visualizar, reprogramar y cancelar sus visitas asignadas.

---

## 🎯 Funcionalidades Implementadas

### Para Agentes
- ✅ **Agendar visitas** para clientes desde el panel de propiedades
- ✅ **Ver todas las visitas** programadas en una tabla dedicada
- ✅ **Reagendar visitas** existentes (cambiar fecha, hora y notas)
- ✅ **Seleccionar cliente** desde dropdown (sin necesidad de escribir ID manualmente)

### Para Administradores
- ✅ **Ver todas las visitas** del sistema en una tabla centralizada
- ✅ **Reagendar cualquier visita** independientemente del agente/cliente
- ✅ **Gestión completa** con filtros y estados visuales

### Para Clientes
- ✅ **Ver visitas programadas** en su dashboard personal
- ✅ **Reprogramar visitas** (cambiar fecha y hora)
- ✅ **Cancelar visitas** cuando sea necesario
- ✅ **Ver detalles** de la propiedad asociada a cada visita
- ✅ **Indicador visual** cuando usa modo offline (localStorage fallback)

---

## 🏗️ Arquitectura Técnica

### Frontend (React + Vite)

#### Servicios API (`src/services/api.js`)
```javascript
// Crear visita (agente/admin)
createVisit({ id_propiedad, id_cliente, id_agente, fecha_visita, hora_visita, notas })

// Obtener visitas de un cliente
getVisitas(id_cliente)

// Obtener todas las visitas (admin/agente)
getAllVisitas()

// Actualizar/reagendar visita
updateVisit({ id_visita, id_cliente, fecha_visita, hora_visita, notas })
reagendarVisita({ id_visita, id_cliente, fecha_visita, hora_visita, notas })

// Cancelar visita
cancelVisit(id_visita, id_cliente)

// Obtener lista de clientes
getClientes()
```

**Características clave:**
- 🔄 **Fallback automático a localStorage**: Si el backend no está disponible o devuelve 404, los datos se guardan localmente
- 🔔 **Indicadores visuales**: Banner que avisa cuando se usa modo local
- 📦 **Almacenamiento por cliente**: Cada cliente tiene su propio localStorage key (`visitas_{id_cliente}`)

#### Componentes

**`src/dashboard/cliente/ClienteDashboard.jsx`**
- Muestra visitas del cliente autenticado
- Tabla con: fecha, hora, propiedad (link), estado, acciones
- Modal para reprogramar con fecha/hora
- Botón cancelar con confirmación
- Enriquecimiento de datos (trae info de propiedad para mostrar tipo y dirección)

**`src/dashboard/agente/PropiedadesAgente.jsx`**
- Tabs: Propiedades | Visitas
- Modal para agendar visita con dropdown de clientes
- Tabla de todas las visitas con botón reagendar
- Integración con ToastContext para notificaciones

**`src/dashboard/admin/PropiedadesAdmin.jsx`**
- Tabs: Propiedades | Visitas
- Vista administrativa de todas las visitas del sistema
- Botón reagendar para cada visita
- Muestra nombre del cliente junto al ID

**`src/components/PropertyDetail.jsx`**
- Removido: capacidad del cliente de agendar visitas directamente
- Mantiene: botón "Me interesa" y favoritos
- **Razón**: Workflow correcto es agente→cliente, no cliente autogestión

---

### Backend (Node.js + Express)

#### Ubicación
- Carpeta: `.vscode/` (backend principal del proyecto)
- Puerto: `4000` (configurable en `.env`)
- Prefijo API: `/api`

#### Endpoints Implementados

**GET `/api/visitas`**
- Query opcional: `?id_cliente=<number>`
- Respuesta: Array de visitas ordenadas por fecha descendente
- Campos: `id_visita, id_propiedad, id_cliente, id_agente, fecha_visita, hora_visita, notas, estado_visita`

**POST `/api/visitas`**
- Body JSON: `{ id_propiedad, id_cliente, id_agente, fecha_visita, hora_visita, notas }`
- Campos obligatorios: `id_propiedad, id_cliente, id_agente, fecha_visita`
- Respuesta: `{ ok: true, id_visita: <insertId> }`
- Estado por defecto: `'Programada'`

**PUT `/api/visitas/:id`**
- Body JSON: `{ fecha_visita, hora_visita, notas, estado }`
- Actualiza campos enviados (parcial)
- Respuesta: Objeto visita actualizado

**PATCH `/api/visitas/:id/cancelar`**
- Cambia estado a `'Cancelada'`
- Respuesta: Objeto visita cancelado

**GET `/api/clientes`**
- Lista todos los clientes disponibles
- Usado para dropdown en modal de agendamiento

#### Archivos Modificados/Creados

**`.vscode/src/models/visita.model.js`**
```javascript
- createVisita() - ahora acepta hora_visita
- getVisitas() - devuelve todas las visitas con alias estado_visita
- getVisitasByCliente() - filtra por id_cliente
- updateVisita() - acepta fecha_visita, hora_visita, notas, estado
- cancelarVisita() - cambia estado a 'Cancelada'
```

**`.vscode/src/controllers/visita.controller.js`**
```javascript
- registrarVisita() - crea visita con hora
- listarVisitas() - GET con filtro opcional por cliente
- actualizarVisita() - PUT para reagendar
- cancelarVisitaController() - PATCH para cancelar
```

**`.vscode/src/routes/visita.routes.js`**
```javascript
GET / - listar visitas
POST / - crear visita
PUT /:id - actualizar visita
PATCH /:id/cancelar - cancelar visita
```

---

## 🗄️ Base de Datos

### Tabla `visita`

**Cambios aplicados:**
```sql
-- 1. Columna para hora específica de la visita
ALTER TABLE visita
  ADD COLUMN hora_visita TIME NULL AFTER fecha_visita;

-- 2. Estado por defecto alineado con frontend
ALTER TABLE visita
  MODIFY COLUMN estado VARCHAR(50) NOT NULL DEFAULT 'Programada';

-- 3. Índice para optimizar consultas por cliente
CREATE INDEX idx_visita_cliente_fecha ON visita (id_cliente, fecha_visita);
```

**Estructura final:**
```
id_visita        INT AUTO_INCREMENT PRIMARY KEY
id_propiedad     INT (FK → propiedad)
id_cliente       INT (FK → cliente)
id_agente        INT (FK → usuario)
fecha_visita     DATE NOT NULL
hora_visita      TIME NULL
estado           VARCHAR(50) DEFAULT 'Programada'
notas            TEXT NULL
```

**Estados válidos:**
- `Programada` - recién creada
- `Confirmada` - confirmada por cliente o agente
- `Cancelada` - cancelada por cualquier parte
- `Completada` - visita realizada (futuro)

---

## 🔄 Flujo de Trabajo Completo

### Agendar Visita (Agente → Cliente)

1. **Agente** inicia sesión y va a "Mis Propiedades"
2. Selecciona una propiedad y hace clic en **"Agendar visita"**
3. Modal se abre con:
   - Dropdown de clientes (nombres + IDs)
   - Campo fecha (date picker)
   - Campo hora (time picker)
   - Campo notas (textarea opcional)
4. Al **enviar**:
   - POST a `/api/visitas` con todos los datos
   - Si backend no disponible → guarda en `localStorage` bajo `visitas_{id_cliente}`
   - Toast de confirmación
5. **Cliente** inicia sesión → ve la visita en su dashboard automáticamente

### Reagendar Visita (Admin/Agente/Cliente)

1. Usuario ve la visita en su tabla respectiva
2. Hace clic en **"Reagendar"**
3. Modal con fecha y hora prellenados
4. Modifica y guarda
5. PUT a `/api/visitas/:id` con nuevos valores
6. Tabla se actualiza en tiempo real

### Cancelar Visita (Cliente/Admin/Agente)

1. Usuario hace clic en **"Cancelar"**
2. Confirmación modal o directa
3. PATCH a `/api/visitas/:id/cancelar`
4. Estado cambia a "Cancelada"
5. Badge visual cambia a rojo

---

## 📊 Casos de Uso con localStorage (Fallback)

**Cuándo se activa:**
- Backend no está corriendo
- Endpoint devuelve 404 (no implementado)
- Error de red

**Qué almacena:**
- Clave: `visitas_{id_cliente}` para cada cliente
- Valor: Array JSON de visitas
- Campos: incluye `_local: true` como flag

**Sincronización:**
- Al recargar, si backend vuelve → migrar datos (manual por ahora)
- Banner avisa al usuario que está en modo local

**Ejemplo de dato localStorage:**
```json
// Key: visitas_32
[
  {
    "id_visita": 1731049200000,
    "id_propiedad": 101,
    "id_cliente": 32,
    "fecha_visita": "2025-11-10",
    "hora_visita": "14:30",
    "notas": "Primera visita",
    "estado_visita": "Programada",
    "_local": true
  }
]
```

---

## 🎨 Interfaz de Usuario

### Características UI/UX

- ✅ **Tabs navegables** (Propiedades | Visitas) en admin/agente
- ✅ **Tablas responsivas** con degradados y estados visuales
- ✅ **Badges de estado** con colores semánticos:
  - 🔵 Programada - azul
  - 🟢 Confirmada - verde
  - 🔴 Cancelada - rojo
- ✅ **Modales con validación** (campos requeridos)
- ✅ **Toast notifications** para feedback inmediato
- ✅ **Spinners de carga** durante peticiones
- ✅ **Links a propiedades** desde tabla de visitas
- ✅ **Formato de fechas** localizado (español)
- ✅ **Banner informativo** cuando usa localStorage

---

## 🧪 Pruebas Manuales

### Desde PowerShell

**1. Crear visita:**
```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:4000/api/visitas `
  -Body (@{
    id_propiedad=101
    id_cliente=32
    id_agente=9
    fecha_visita='2025-11-12'
    hora_visita='10:30'
    notas='Llevar documentos'
  } | ConvertTo-Json) `
  -ContentType 'application/json'
```

**2. Listar todas:**
```powershell
Invoke-RestMethod -Uri http://localhost:4000/api/visitas
```

**3. Listar por cliente:**
```powershell
Invoke-RestMethod -Uri http://localhost:4000/api/visitas?id_cliente=32
```

**4. Reagendar:**
```powershell
Invoke-RestMethod -Method Put -Uri http://localhost:4000/api/visitas/123 `
  -Body (@{
    fecha_visita='2025-11-13'
    hora_visita='14:00'
  } | ConvertTo-Json) `
  -ContentType 'application/json'
```

**5. Cancelar:**
```powershell
Invoke-RestMethod -Method Patch -Uri http://localhost:4000/api/visitas/123/cancelar
```

### Desde la UI

**Test completo agente→cliente:**
1. Login como agente (credenciales de prueba)
2. Ir a "Mis Propiedades"
3. Agendar visita para cliente ID 32
4. Logout
5. Login como cliente (ID 32)
6. Verificar visita aparece en dashboard
7. Reprogramar visita
8. Verificar cambio reflejado
9. Cancelar visita
10. Verificar estado "Cancelada"

---

## 📁 Estructura de Archivos

```
inmogestion-frontend/src/
├── services/
│   └── api.js                           [+getAllVisitas, +reagendarVisita, +getClientes]
├── dashboard/
│   ├── cliente/
│   │   └── ClienteDashboard.jsx         [+tabla visitas, +modal reagendar]
│   ├── agente/
│   │   └── PropiedadesAgente.jsx        [+tabs, +modal agendar, +tabla visitas]
│   └── admin/
│       └── PropiedadesAdmin.jsx         [+tabs, +tabla visitas, +reagendar]
└── components/
    └── PropertyDetail.jsx               [-modal agendar (removido)]

.vscode/src/
├── models/
│   └── visita.model.js                  [+getVisitas, +getVisitasByCliente, +updateVisita, +cancelarVisita]
├── controllers/
│   └── visita.controller.js             [+listarVisitas, +actualizarVisita, +cancelarVisitaController]
└── routes/
    └── visita.routes.js                 [+GET, +PUT, +PATCH]
```

---

## 🚀 Instrucciones de Uso

### Iniciar Backend
```powershell
cd .vscode
npm install
npm run dev
```

### Iniciar Frontend
```powershell
cd inmogestion-frontend
npm install
npm run dev
```

### Acceso
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Endpoints: http://localhost:4000/api/visitas

---

## 🔐 Seguridad y Permisos

**Estado actual:**
- Endpoint `/api/visitas` **NO requiere autenticación** por simplicidad de desarrollo
- Endpoint `/api/clientes` **NO requiere autenticación**

**Recomendaciones para producción:**
1. Agregar middleware `verificarToken` a rutas de visitas
2. Validar que el agente solo vea sus propias visitas
3. Validar que el cliente solo vea/modifique sus propias visitas
4. Admin puede ver todo

**Ejemplo futuro:**
```javascript
// En visita.routes.js
import { verificarToken, verificarRol } from '../middleware/auth.middleware.js';

router.get('/', verificarToken, listarVisitas);
router.post('/', verificarToken, verificarRol(['agente', 'admin']), registrarVisita);
```

---

## 📈 Mejoras Futuras

### Funcionalidad
- [ ] Notificaciones push/email cuando se agenda una visita
- [ ] Recordatorios automáticos 24h antes de la visita
- [ ] Calendario visual (integración con FullCalendar)
- [ ] Visitas recurrentes/periódicas
- [ ] Asignar múltiples agentes a una visita
- [ ] Notas privadas del agente vs notas visibles al cliente
- [ ] Historial de cambios (auditoría de reagendamientos)

### Técnico
- [ ] Paginación en tabla de visitas (cuando hay muchas)
- [ ] Filtros avanzados (por rango de fechas, estado, propiedad)
- [ ] Exportar visitas a CSV/PDF
- [ ] WebSockets para actualización en tiempo real
- [ ] Tests unitarios e integración
- [ ] Migración automática de localStorage a DB cuando backend vuelve online

### UX
- [ ] Vista de calendario mensual
- [ ] Arrastrar y soltar para reagendar
- [ ] Vista de mapa con propiedades y visitas
- [ ] Rating/feedback post-visita

---

## 🐛 Troubleshooting

**Problema:** Visitas no aparecen en el cliente
- ✅ Verificar que `id_cliente` en la visita coincide con el del usuario autenticado
- ✅ Revisar localStorage si backend está caído: `visitas_32`
- ✅ Confirmar que el backend devuelve `estado_visita` (alias en SELECT)

**Problema:** Dropdown de clientes vacío
- ✅ Verificar endpoint `/api/clientes` está disponible
- ✅ Revisar consola: debe aparecer mock fallback si backend falla
- ✅ Confirmar que `getClientes()` retorna array con `id_cliente` y `nombre_cliente`

**Problema:** Error al reagendar
- ✅ Verificar que PUT envía `id_cliente` junto con `id_visita`
- ✅ Confirmar que backend acepta campos parciales
- ✅ Revisar que la visita existe en DB/localStorage

**Problema:** Estados no se actualizan visualmente
- ✅ Verificar que backend devuelve campo `estado_visita` (no solo `estado`)
- ✅ Confirmar que el componente actualiza state local después de PUT/PATCH
- ✅ Revisar mapeo de colores en className del badge

---

## 📝 Changelog

### v1.0.0 - 2025-11-08
- ✅ Sistema completo de visitas frontend + backend
- ✅ CRUD completo: crear, listar, actualizar, cancelar
- ✅ Integración con DB MySQL (tabla `visita`)
- ✅ Fallback a localStorage para desarrollo offline
- ✅ Dropdown de clientes en modal de agendamiento
- ✅ Tabs en admin/agente para separar propiedades y visitas
- ✅ Documentación API completa
- ✅ README actualizado con instrucciones
- ✅ Soporte para hora_visita (columna agregada a DB)
- ✅ Estado por defecto 'Programada' alineado frontend/backend

---

## 👥 Créditos

**Desarrollado para:** InmoGestión  
**Fecha:** Noviembre 2025  
**Stack:** React + Vite + TailwindCSS + Express + MySQL  
**Patrón:** Arquitectura Cliente-Servidor con fallback offline  

---

**Fin de la documentación técnica del Módulo de Visitas**
