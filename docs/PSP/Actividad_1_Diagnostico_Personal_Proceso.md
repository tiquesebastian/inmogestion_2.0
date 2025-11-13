# ACTIVIDAD 1: Diagnóstico Personal de Proceso
## Personal Software Process (PSP) - InmoGestión

**Estudiante:** [Tu Nombre]  
**Proyecto:** InmoGestión - Sistema de Gestión Inmobiliaria  
**Fecha:** 12 de noviembre de 2025

---

## 1. Descripción del Proceso Actual de Desarrollo

### 1.1 Fase de Análisis de Requerimientos
**Duración estimada:** 2-3 horas por módulo

**Actividades:**
1. **Recepción del requerimiento:** El cliente o líder de proyecto presenta la necesidad (ej: "necesitamos un módulo de gestión de contratos")
2. **Comprensión inicial:** Leo y analizo el requerimiento, identifico actores principales (Admin, Agente, Cliente)
3. **Definición de alcance:** Documento qué funcionalidades específicas se implementarán
4. **Consulta de referencias:** Reviso documentación existente (`docs/API_CONTRACT.md`, `README.md`)
5. **Preguntas y aclaraciones:** Si hay ambigüedades, consulto con stakeholders

**Herramientas utilizadas:**
- Documento de requerimientos (Word/Notion)
- Diagramas de casos de uso (draw.io)

---

### 1.2 Fase de Diseño
**Duración estimada:** 3-4 horas por módulo

**Actividades:**
1. **Diseño de base de datos:**
   - Identifico entidades necesarias (ej: `contrato`, `cliente`, `propiedad`)
   - Defino relaciones y claves foráneas
   - Actualizo archivo `db/schema.sql`

2. **Diseño de API:**
   - Defino endpoints RESTful necesarios
   - Especifico métodos HTTP (GET, POST, PUT, DELETE)
   - Documento estructura de request/response en `docs/API_CONTRACT.md`

3. **Diseño de interfaz:**
   - Creo wireframes simples (papel o Figma)
   - Defino flujo de navegación del usuario
   - Identifico componentes React reutilizables

**Herramientas utilizadas:**
- MySQL Workbench para modelado de BD
- Postman/Bruno para diseño de API
- Figma/Draw.io para wireframes

---

### 1.3 Fase de Implementación
**Duración estimada:** 8-15 horas por módulo (variable según complejidad)

#### Backend (`.vscode/src/`)
1. **Modelo de datos** (`models/`)
   - Creo funciones SQL para CRUD
   - Implemento validaciones de integridad

2. **Controlador** (`controllers/`)
   - Implemento lógica de negocio
   - Manejo de errores y respuestas HTTP

3. **Rutas** (`routes/`)
   - Defino endpoints
   - Aplico middlewares de autenticación (`verificarToken`, `verificarRol`)

#### Frontend (`inmogestion-frontend/src/`)
1. **Servicios API** (`services/api.js`)
   - Creo funciones para consumir endpoints
   - Implemento manejo de errores

2. **Componentes React** (`components/`, `dashboard/`)
   - Desarrollo componentes funcionales con hooks
   - Implemento Context API si es necesario (AuthContext, ToastContext)

3. **Estilos** (TailwindCSS)
   - Aplico clases de utilidad
   - Aseguro diseño responsivo

**Metodología:**
- Desarrollo incremental: primero backend, luego frontend
- Commits frecuentes en Git con mensajes descriptivos
- Testing manual durante desarrollo

**Herramientas utilizadas:**
- VS Code como IDE principal
- Git para control de versiones
- Postman/Bruno para pruebas de API
- MySQL Workbench para consultas directas

---

### 1.4 Fase de Pruebas
**Duración estimada:** 2-4 horas por módulo

**Actividades:**
1. **Pruebas unitarias:** 
   - Verifico funciones individuales (modelos, controladores)
   - Actualmente: testing manual (pendiente automatización)

2. **Pruebas de integración:**
   - Verifico flujo completo: Frontend → API → Base de datos
   - Pruebo diferentes roles (Admin, Agente, Cliente)

3. **Pruebas de UI/UX:**
   - Verifico diseño responsivo (móvil, tablet, desktop)
   - Valido mensajes de error y confirmaciones

4. **Identificación de defectos:**
   - Registro bugs en GitHub Issues
   - Clasifico por severidad (crítico, alto, medio, bajo)

**Criterios de aceptación:**
- ✅ Todas las funcionalidades principales operativas
- ✅ Sin errores 500 en API
- ✅ Diseño funcional en móvil y desktop
- ✅ Validaciones de formularios funcionando

---

### 1.5 Fase de Corrección de Defectos
**Duración estimada:** 1-3 horas (variable)

**Actividades:**
1. **Reproducción del bug:** Identifico pasos para replicar el error
2. **Análisis de causa raíz:** Uso DevTools, logs de servidor, console.log
3. **Implementación del fix:** Corrijo código y verifico que no rompe otras funcionalidades
4. **Re-testing:** Pruebo el flujo completo nuevamente
5. **Commit del fix:** `git commit -m "fix: corrige validación en formulario de contrato"`

---

### 1.6 Fase de Documentación
**Duración estimada:** 1-2 horas por módulo

**Actividades:**
1. **Documentación técnica:**
   - Actualizo `docs/API_CONTRACT.md` con nuevos endpoints
   - Agrego comentarios JSDoc en funciones complejas
   - Actualizo diagramas de base de datos si hubo cambios

2. **Documentación de usuario:**
   - Creo guías de uso si es necesario
   - Actualizo `README.md` con nuevas funcionalidades

3. **Changelog:**
   - Documento cambios importantes en el sistema

---

### 1.7 Fase de Deployment
**Duración estimada:** 1-2 horas

**Actividades:**
1. **Preparación:**
   - Verifico que todas las pruebas pasen
   - Reviso variables de entorno (`.env`)
   - Creo backup de base de datos

2. **Deploy:**
   - Backend: `npm start` en servidor
   - Frontend: `npm run build` → deploy en hosting
   - Base de datos: ejecuto migraciones si es necesario

3. **Monitoreo post-deploy:**
   - Verifico logs de servidor
   - Confirmo que el sistema está accesible
   - Monitoreo primeras interacciones de usuarios

---

## 2. Diagrama de Flujo del Proceso Personal

```
┌─────────────────────────────────────────────────────────────┐
│                    INICIO DEL PROYECTO                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  1. ANÁLISIS DE REQUERIMIENTOS                               │
│  - Leer requerimiento                                        │
│  - Aclarar dudas con stakeholders                            │
│  - Definir alcance                                           │
│  Tiempo: 2-3 horas                                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  2. DISEÑO                                                   │
│  - Diseñar modelo de datos (SQL)                             │
│  - Definir API endpoints                                     │
│  - Crear wireframes UI                                       │
│  Tiempo: 3-4 horas                                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  3. IMPLEMENTACIÓN                                           │
│  ┌──────────────────┐    ┌──────────────────┐               │
│  │  Backend         │    │  Frontend        │               │
│  │  - Models        │    │  - Services      │               │
│  │  - Controllers   │ ─→ │  - Components    │               │
│  │  - Routes        │    │  - Styles        │               │
│  └──────────────────┘    └──────────────────┘               │
│  Tiempo: 8-15 horas                                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  4. PRUEBAS MANUALES                                         │
│  - Testing de API (Postman/Bruno)                            │
│  - Testing de UI (navegador)                                 │
│  - Testing de integración                                    │
│  Tiempo: 2-4 horas                                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
                ┌───────┴────────┐
                │  ¿Defectos?    │
                └───────┬────────┘
                        │
            ┌───────────┼───────────┐
            │ SÍ                    │ NO
            ▼                       ▼
┌─────────────────────┐   ┌─────────────────────┐
│  5. CORRECCIÓN      │   │  6. DOCUMENTACIÓN   │
│  - Debug            │   │  - API docs         │
│  - Fix code         │   │  - README           │
│  - Re-test          │   │  - Comentarios      │
│  Tiempo: 1-3 horas  │   │  Tiempo: 1-2 horas  │
└──────────┬──────────┘   └──────────┬──────────┘
           │                         │
           └───────────┬─────────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │  7. COMMIT & PUSH     │
           │  - git add .          │
           │  - git commit -m ""   │
           │  - git push           │
           └───────────┬───────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │  8. DEPLOYMENT        │
           │  - Build production   │
           │  - Deploy backend     │
           │  - Deploy frontend    │
           │  Tiempo: 1-2 horas    │
           └───────────┬───────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │  9. MONITOREO         │
           │  - Verificar logs     │
           │  - Testing en prod    │
           └───────────┬───────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │    FIN DEL CICLO      │
           │  (Iteración completa) │
           └───────────────────────┘
```

---

## 3. Análisis FODA del Proceso Personal

### 3.1 FORTALEZAS (Strengths)

| # | Fortaleza | Descripción | Evidencia en el Proyecto |
|---|-----------|-------------|--------------------------|
| 1 | **Documentación estructurada** | Mantengo documentación actualizada de API, instalación y flujos de trabajo | `docs/API_CONTRACT.md`, `README.md`, `INSTALL.md` |
| 2 | **Control de versiones disciplinado** | Uso Git con commits descriptivos y flujo de trabajo definido | `Git_workflow.md`, historial de commits en GitHub |
| 3 | **Arquitectura modular** | Separación clara de responsabilidades (MVC en backend, componentes en frontend) | Estructura `controllers/`, `models/`, `routes/` + `components/`, `services/` |
| 4 | **Manejo de contexto global** | Implementación de Context API para estado compartido | `AuthContext.jsx`, `ToastContext.jsx` |
| 5 | **Seguridad implementada** | JWT, bcrypt, validaciones, middlewares de autorización | `auth.middleware.js`, uso de bcryptjs |
| 6 | **API RESTful bien diseñada** | Endpoints consistentes, uso correcto de métodos HTTP | `/api/propiedades`, `/api/contratos`, etc. |
| 7 | **Diseño responsivo** | Uso de TailwindCSS para interfaces adaptables | Componentes con clases responsive de Tailwind |
| 8 | **Gestión de dependencias** | Uso de package.json para dependencias versionadas | `package.json` en backend y frontend |

---

### 3.2 OPORTUNIDADES (Opportunities)

| # | Oportunidad | Descripción | Acción Propuesta |
|---|-------------|-------------|------------------|
| 1 | **Testing automatizado** | Implementar tests unitarios y e2e | Agregar Jest para backend, React Testing Library para frontend |
| 2 | **CI/CD completo** | Automatizar deployment con GitHub Actions | Crear workflows para build, test y deploy automático |
| 3 | **Monitoreo de errores** | Implementar logging avanzado y tracking de errores | Integrar Sentry o similar para monitoreo en producción |
| 4 | **Métricas de código** | Análisis de calidad de código automatizado | Integrar SonarQube o CodeClimate |
| 5 | **Documentación de API con Swagger** | Auto-generación de documentación interactiva | Implementar swagger-jsdoc y swagger-ui-express |
| 6 | **Optimización de rendimiento** | Implementar caché, lazy loading, paginación | Redis para caché, React.lazy() para componentes |
| 7 | **Accesibilidad (a11y)** | Mejorar accesibilidad web | Auditoría con Lighthouse, ARIA labels |
| 8 | **Metodología ágil formal** | Adoptar Scrum/Kanban con sprints definidos | Usar Jira/Trello con board de tareas |

---

### 3.3 DEBILIDADES (Weaknesses)

| # | Debilidad | Descripción | Impacto | Plan de Mejora |
|---|-----------|-------------|---------|----------------|
| 1 | **Falta de estimaciones precisas** | No registro tiempo real vs estimado de cada tarea | ⚠️ Alto | Implementar time tracking con Clockify/Toggl |
| 2 | **Testing manual únicamente** | No hay tests automatizados, solo pruebas manuales | ⚠️ Alto | Crear suite de tests con Jest + Supertest (backend) |
| 3 | **Registro de defectos informal** | No hay sistema estructurado de tracking de bugs | ⚠️ Medio | Usar GitHub Issues con templates y labels |
| 4 | **Sin métricas de productividad** | No mido LOC/hora, densidad de defectos, etc. | ⚠️ Alto | Implementar registro de métricas en Excel/Sheets |
| 5 | **Revisiones de código informales** | No hay proceso de code review estructurado | ⚠️ Medio | Implementar Pull Requests obligatorios antes de merge |
| 6 | **Planificación a corto plazo** | Falta planificación detallada de sprints/iteraciones | ⚠️ Medio | Adoptar planning poker y estimaciones PROBE |
| 7 | **Documentación reactiva** | Documento después de implementar, no antes | ⚠️ Bajo | Documentar diseño antes de codificar |
| 8 | **Sin análisis postmortem** | No hago retrospectivas después de cada módulo | ⚠️ Medio | Implementar retrospectivas cada 2 semanas |

---

### 3.4 AMENAZAS (Threats)

| # | Amenaza | Descripción | Mitigación |
|---|---------|-------------|------------|
| 1 | **Deuda técnica acumulada** | Código sin refactorizar puede volverse inmantenible | Dedicar 20% del tiempo a refactoring |
| 2 | **Dependencias obsoletas** | Librerías que pueden quedar desactualizadas | Auditoría mensual con `npm audit` |
| 3 | **Falta de backups automáticos** | Pérdida de datos si no hay backups regulares de BD | Implementar cron jobs para backups diarios |
| 4 | **Burnout por no medir esfuerzo** | Sobrecarga de trabajo sin registro de horas | Time tracking obligatorio y límites de horas |
| 5 | **Errores en producción sin detectar** | Sin monitoreo, bugs pueden pasar desapercibidos | Implementar error tracking (Sentry) |
| 6 | **Falta de documentación de decisiones** | Olvidar por qué se tomaron ciertas decisiones arquitectónicas | Mantener ADR (Architecture Decision Records) |
| 7 | **Regresiones sin detectar** | Cambios que rompen funcionalidades existentes | Tests de regresión automatizados |
| 8 | **Estimaciones optimistas** | Subestimar tiempo de desarrollo genera retrasos | Aplicar método PROBE con factor de corrección |

---

## 4. Conclusiones del Diagnóstico

### 4.1 Hallazgos Principales

**Aspectos Positivos:**
- ✅ El proyecto tiene una arquitectura sólida y bien estructurada
- ✅ Existe documentación técnica básica (README, API_CONTRACT)
- ✅ Uso correcto de control de versiones con Git
- ✅ Implementación de seguridad (JWT, bcrypt, CORS)

**Áreas Críticas de Mejora:**
- ❌ **Falta absoluta de métricas:** No se mide tiempo, defectos, productividad
- ❌ **Testing manual únicamente:** Alto riesgo de regresiones
- ❌ **Sin proceso de estimación:** Imposible predecir tiempos con precisión
- ❌ **No hay retrospectivas:** No se aprende sistemáticamente de errores

### 4.2 Impacto en la Calidad del Software

| Aspecto | Estado Actual | Impacto | Prioridad |
|---------|---------------|---------|-----------|
| **Calidad del código** | ⚠️ Media | Deuda técnica creciente | Alta |
| **Confiabilidad** | ⚠️ Media | Bugs no detectados temprano | Alta |
| **Mantenibilidad** | ✅ Buena | Código modular facilita cambios | Media |
| **Predictibilidad** | ❌ Baja | No se puede estimar con certeza | Crítica |
| **Productividad** | ⚠️ Desconocida | No se mide, no se puede mejorar | Alta |

### 4.3 Plan de Acción Inmediato

**Prioridad 1 (Implementar en próximas 2 semanas):**
1. ✅ Implementar time tracking (Clockify/Toggl)
2. ✅ Crear templates de GitHub Issues para bugs y features
3. ✅ Comenzar registro de métricas en Excel (tiempo, LOC, defectos)
4. ✅ Aplicar método PROBE para próximos módulos

**Prioridad 2 (Implementar en próximo mes):**
1. Configurar Jest y escribir tests básicos
2. Implementar code reviews obligatorios (PRs)
3. Crear proceso de retrospectivas quincenales
4. Documentar decisiones arquitectónicas (ADR)

**Prioridad 3 (Implementar en próximos 3 meses):**
1. Integrar CI/CD con GitHub Actions
2. Implementar error tracking (Sentry)
3. Configurar SonarQube para análisis de código
4. Crear suite completa de tests e2e

---

## 5. Reflexión Personal

### ¿Qué he aprendido sobre mi proceso?

**Insight 1: "Lo que no se mide, no se puede mejorar"**
- Actualmente trabajo sin datos concretos sobre mi rendimiento
- No puedo saber si estoy mejorando o empeorando con el tiempo
- **Acción:** Empezar a medir TODO (tiempo, defectos, LOC)

**Insight 2: "El testing manual no escala"**
- Cada vez que agrego una feature, debo probar TODAS las anteriores
- Esto consume tiempo exponencialmente
- **Acción:** Invertir tiempo en automatización para ganar en el futuro

**Insight 3: "Las estimaciones son fundamentales"**
- Sin estimaciones, es imposible planificar sprints
- Los stakeholders no tienen visibilidad de cuándo estará listo algo
- **Acción:** Aplicar PROBE con datos históricos del proyecto

**Insight 4: "La documentación es una inversión"**
- Documentar ANTES de codificar me ahorra tiempo de refactoring
- Future-me agradece a present-me por documentar decisiones
- **Acción:** Documentar diseño antes de implementar

---

## 6. Próximos Pasos

1. ✅ **Completar Actividad 2:** Aplicar método PROBE a próximo módulo
2. ✅ **Completar Actividad 3:** Calcular métricas actuales del proyecto
3. ✅ **Completar Actividad 4:** Documentar herramientas digitales en uso
4. ✅ **Completar Actividad 5:** Crear Plan de Mejora Personal (PPIP)
5. 📝 **Iterar proceso:** Aplicar mejoras y medir resultados

---

**Firma:** _______________________  
**Fecha:** 12 de noviembre de 2025

---

> **Nota:** Este documento forma parte del proceso de aplicación del Personal Software Process (PSP) al proyecto InmoGestión. Se actualizará periódicamente conforme se implementen mejoras.
