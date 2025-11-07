# API Contract - InmoGestión

Este documento describe los endpoints mínimos a implementar para el Área Pública (cliente), Agentes y Administrador, con ejemplos de request/response y notas de autorización.

Base URL: `http://localhost:4000/api`

---

## 1) Filtrado de propiedades

GET /properties/filter

Query parameters:
- q (string, opcional): búsqueda por texto (título, dirección)
- tipo (string, opcional)
- min_price (number, opcional)
- max_price (number, opcional)
- localidad_id (int, opcional)
- barrio_id (int, opcional)
- estado (string, opcional) — e.g. 'Disponible'
- page (int, opcional) — paginación
- limit (int, opcional)

Response 200:
{
  "data": [ { /* propiedad resumida */ } ],
  "page": 1,
  "limit": 20,
  "total": 123
}

Errors: 400 Bad Request, 500 Server Error

---

## 2) Detalle de propiedad

GET /properties/:id

Response 200:
{
  "id_propiedad": 1,
  "titulo": "Casa en X",
  "descripcion": "...",
  "precio": 350000000,
  "direccion": "...",
  "barrio": { id, nombre },
  "localidad": { id, nombre },
  "imagenes": ["url1","url2"],
  "estado": "Disponible"
}

Errors: 404 Not Found, 500 Server Error

---

## 3) Registrar interés / Contacto (cliente interesado)

POST /properties/:id/interest
Body (JSON):
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "telefono": "3001234567",
  "mensaje": "Estoy interesado en visitar el inmueble",
  "preferencias": { "fecha": "2025-11-10", "hora": "10:00" }
}

Behavior:
- Si el usuario no existe, crear cliente ligero (tabla `cliente`) o solicitar registro según opciones.
- Guardar registro en tabla `interes_propiedad` con estado 'Pendiente'.
- Enviar notificación por email y/o generar enlace de WhatsApp para el agente asignado.

Response 201:
{ "ok": true, "id_interes": 12 }

Errors: 400 Validation, 500 Server Error

---

## 4) Registro de visita (Agente)

POST /visits
Header: Authorization: Bearer <token>
Body:
{
  "id_propiedad": 1,
  "id_cliente": 2,
  "fecha_visita": "2025-11-12T10:00:00",
  "notas": "Cliente llega puntual"
}

Response 201:
{ "ok": true, "id_visita": 5 }

Errors: 401 Unauthorized, 400 Validation

---

## 5) CRUD Propiedad (Agente/Admin)

- POST /properties    (crear)  — auth
- PUT /properties/:id (actualizar) — auth
- DELETE /properties/:id — auth

Request/response: standard REST JSON with validation

---

## 6) Estadísticas y reportes (Admin)

GET /statistics/sales?start=YYYY-MM-DD&end=YYYY-MM-DD

Response 200:
{
  "ventas_total": 123,
  "valor_total": 1230000000,
  "por_agente": [ { "id_usuario":1, "nombre":"Ana", "ventas":10 } ],
  "por_localidad": [ { "id_localidad":2, "ventas": 40 } ]
}

---

## Notas de seguridad y validación
- Todos los endpoints que modifican datos requieren JWT con rol adecuado (Agente/Administrador)
- Inputs deben validarse y sanitizarse
- Registrar actividades en `auditoria`

---

Si quieres, puedo generar los controladores y rutas base para estos endpoints y/o crear los componentes front para el flujo público (filtrado, detalle, interés).

---

## 7) Contratos (Admin/Agente)

Base: `/contratos`

- GET /contratos — lista todos los contratos
- GET /contratos/:id — detalle de un contrato
- GET /contratos/cliente/:id_cliente — contratos por cliente
- GET /contratos/propiedad/:id_propiedad — contratos por propiedad
- POST /contratos — crear contrato
- PUT /contratos/:id — actualizar contrato completo
- PATCH /contratos/:id/estado — actualizar solo el estado
- DELETE /contratos/:id — eliminar contrato

Body POST (JSON):
{
  "fecha_contrato": "2025-11-07",
  "valor_venta": 350000000,
  "fecha_venta": "2025-11-10", // opcional
  "archivo_pdf": "contratos/2025-11-07-abc.pdf", // opcional
  "id_propiedad": 12,
  "id_cliente": 34,
  "id_usuario": 2, // agente/admin que registra
  "estado_contrato": "Activo" // por defecto 'Activo'
}

Response 201:
{ "message": "Contrato creado", "contratoId": 77 }

Body PATCH /contratos/:id/estado (JSON):
{ "estado_contrato": "Cerrado" }

Responses:
- 200 { "message": "Estado de contrato actualizado" }
- 404 { "message": "Contrato no encontrado" }

Notas:
- Validaciones: `valor_venta > 0`, existencia de `id_propiedad`, `id_cliente`, `id_usuario`.
- Orden por `fecha_contrato DESC` en listados.

---

## 8) Historial de estado de propiedad

Base: `/historial`

- GET /historial — lista global (ordenado por `fecha_cambio DESC`)
- GET /historial?id_propiedad=12 — historial por propiedad
- POST /historial — inserta un cambio manual (normalmente se registra automáticamente al cambiar el estado de una propiedad)
- DELETE /historial/:id — elimina un registro

Body POST (JSON):
{
  "estado_anterior": "Disponible",
  "estado_nuevo": "En negociación",
  "justificacion": "Oferta recibida",
  "id_propiedad": 12,
  "id_usuario": 2
}

Notas:
- El controlador de propiedades registra automáticamente en `historial_estado_propiedad` cuando cambia `estado_propiedad`.

---

## 9) Reportes y Dashboard (Admin)

Base: `/reportes`

**Parámetros comunes (query string):**
- `fecha_inicio` (YYYY-MM-DD) — inicio del rango
- `fecha_fin` (YYYY-MM-DD) — fin del rango
- Si no se proporcionan, usa últimos 30 días por defecto

### Dashboard completo
GET /reportes/dashboard?fecha_inicio=2025-10-01&fecha_fin=2025-11-07

Response 200:
```json
{
  "periodo": { "fecha_inicio": "2025-10-01", "fecha_fin": "2025-11-07" },
  "resumen_ventas": {
    "total_contratos": 15,
    "valor_total": 5250000000,
    "promedio_venta": 350000000
  },
  "ventas_por_agente": [
    { "id_usuario": 2, "nombre": "Ana", "apellido": "García", "total_contratos": 8, "valor_total": 2800000000, "promedio_venta": 350000000 }
  ],
  "ventas_por_localidad": [
    { "id_localidad": 1, "nombre_localidad": "Usaquén", "total_contratos": 6, "valor_total": 2100000000, "precio_promedio": 350000000 }
  ],
  "propiedades_por_estado": [
    { "estado_propiedad": "Disponible", "total": 45, "precio_promedio": 320000000 },
    { "estado_propiedad": "Vendida", "total": 15, "precio_promedio": 350000000 }
  ],
  "top_propiedades_intereses": [
    { "id_propiedad": 12, "tipo_propiedad": "Casa", "direccion_formato": "Calle 100 #15-20", "precio_propiedad": 450000000, "total_intereses": 8, "clientes_unicos": 6 }
  ],
  "funnel_conversion": {
    "intereses": 120,
    "visitas": 45,
    "contratos": 15,
    "tasa_interes_visita": "37.50",
    "tasa_visita_contrato": "33.33",
    "tasa_interes_contrato": "12.50"
  },
  "clientes_nuevos": { "total_nuevos": 23 },
  "tiempo_ciclo_venta": { "dias_promedio": 18.5, "dias_minimo": 7, "dias_maximo": 45 }
}
```

### Resumen de ventas
GET /reportes/ventas/resumen?fecha_inicio=2025-10-01&fecha_fin=2025-11-07

Response 200:
```json
{
  "periodo": { "fecha_inicio": "2025-10-01", "fecha_fin": "2025-11-07" },
  "total_contratos": 15,
  "valor_total": 5250000000,
  "promedio_venta": 350000000
}
```

### Ventas por agente
GET /reportes/ventas/agentes?fecha_inicio=2025-10-01&fecha_fin=2025-11-07

Response 200:
```json
{
  "periodo": { "fecha_inicio": "2025-10-01", "fecha_fin": "2025-11-07" },
  "agentes": [
    { "id_usuario": 2, "nombre": "Ana", "apellido": "García", "total_contratos": 8, "valor_total": 2800000000, "promedio_venta": 350000000 },
    { "id_usuario": 3, "nombre": "Luis", "apellido": "Pérez", "total_contratos": 7, "valor_total": 2450000000, "promedio_venta": 350000000 }
  ]
}
```

### Ventas por localidad
GET /reportes/ventas/localidades?fecha_inicio=2025-10-01&fecha_fin=2025-11-07

Response 200:
```json
{
  "periodo": { "fecha_inicio": "2025-10-01", "fecha_fin": "2025-11-07" },
  "localidades": [
    { "id_localidad": 1, "nombre_localidad": "Usaquén", "total_contratos": 6, "valor_total": 2100000000, "precio_promedio": 350000000 }
  ]
}
```

### Propiedades por estado
GET /reportes/propiedades/estado

Response 200:
```json
{
  "estados": [
    { "estado_propiedad": "Disponible", "total": 45, "precio_promedio": 320000000 },
    { "estado_propiedad": "Reservada", "total": 8, "precio_promedio": 380000000 },
    { "estado_propiedad": "Vendida", "total": 15, "precio_promedio": 350000000 }
  ]
}
```

### Top propiedades con más intereses
GET /reportes/propiedades/top-intereses?fecha_inicio=2025-10-01&fecha_fin=2025-11-07&limit=10

Response 200:
```json
{
  "periodo": { "fecha_inicio": "2025-10-01", "fecha_fin": "2025-11-07" },
  "propiedades": [
    {
      "id_propiedad": 12,
      "tipo_propiedad": "Casa",
      "direccion_formato": "Calle 100 #15-20",
      "precio_propiedad": 450000000,
      "estado_propiedad": "Disponible",
      "nombre_localidad": "Usaquén",
      "nombre_barrio": "Santa Bárbara",
      "total_intereses": 8,
      "clientes_unicos": 6
    }
  ]
}
```

### Funnel de conversión
GET /reportes/funnel?fecha_inicio=2025-10-01&fecha_fin=2025-11-07

Response 200:
```json
{
  "periodo": { "fecha_inicio": "2025-10-01", "fecha_fin": "2025-11-07" },
  "funnel": {
    "intereses": 120,
    "visitas": 45,
    "contratos": 15,
    "tasa_interes_visita": "37.50",
    "tasa_visita_contrato": "33.33",
    "tasa_interes_contrato": "12.50"
  }
}
```

### Clientes nuevos
GET /reportes/clientes/nuevos?fecha_inicio=2025-10-01&fecha_fin=2025-11-07

Response 200:
```json
{
  "periodo": { "fecha_inicio": "2025-10-01", "fecha_fin": "2025-11-07" },
  "total_nuevos": 23
}
```

### Tiempo promedio de ciclo de venta
GET /reportes/ventas/tiempo-ciclo?fecha_inicio=2025-10-01&fecha_fin=2025-11-07

Response 200:
```json
{
  "periodo": { "fecha_inicio": "2025-10-01", "fecha_fin": "2025-11-07" },
  "dias_promedio": 18.5,
  "dias_minimo": 7,
  "dias_maximo": 45
}
```

### Propiedades sin actividad
GET /reportes/propiedades/sin-actividad?dias=30

Response 200:
```json
{
  "dias_sin_actividad": 30,
  "propiedades": [
    {
      "id_propiedad": 34,
      "tipo_propiedad": "Apartamento",
      "direccion_formato": "Carrera 7 #45-12",
      "precio_propiedad": 280000000,
      "estado_propiedad": "Disponible",
      "fecha_registro": "2025-09-15T10:30:00.000Z",
      "nombre_localidad": "Chapinero",
      "nombre_barrio": "Chicó",
      "ultima_actividad": "2025-09-15T10:30:00.000Z",
      "total_intereses": 0,
      "total_visitas": 0
    }
  ]
}
```

**Notas:**
- Todos los endpoints de reportes requieren autenticación con rol Admin
- Los rangos de fecha son inclusivos
- Los valores monetarios están en pesos colombianos (COP)
- Las tasas de conversión están en porcentaje con 2 decimales
