# ACTIVIDAD 5: Personal Process Improvement Plan (PPIP)
## Postmortem y Plan de Mejora Continua - InmoGestión

**Estudiante:** [Tu Nombre]  
**Proyecto:** InmoGestión - Sistema de Gestión Inmobiliaria  
**Período Evaluado:** Septiembre - Noviembre 2025  
**Fecha del Reporte:** 12 de noviembre de 2025

---

## 1. Resumen Ejecutivo

Este documento presenta el **Plan de Mejora del Proceso Personal (PPIP)** derivado del análisis retrospectivo del proyecto InmoGestión. Se identificaron áreas críticas de mejora y se definieron acciones concretas con metas medibles.

**Hallazgos Principales:**
- 🔴 **Crítico:** 67% del tiempo se invirtió en corrección de defectos
- 🟠 **Alto:** Densidad de defectos 5.6x superior al estándar PSP maduro
- 🟡 **Medio:** Error de estimación del 20.7% (meta: <15%)
- 🟢 **Positivo:** Productividad de 39.14 LOC/hora está por encima del promedio

---

## 2. Revisión de Resultados del Proyecto

### 2.1 Métricas Finales Consolidadas

| Métrica | Valor Obtenido | Benchmark PSP | Estado | Gap |
|---------|----------------|---------------|--------|-----|
| **Productividad** | 39.14 LOC/hr | 35-45 LOC/hr | ✅ BUENO | - |
| **Densidad Defectos** | 11.34 /KLOC | 1-2 /KLOC | ❌ CRÍTICO | -9.34 /KLOC |
| **Error Estimación** | 20.7% | <15% | ⚠️ ACEPTABLE | +5.7% |
| **Tiempo Testing** | 10% | 15-20% | ⚠️ BAJO | +5-10% |
| **Tiempo Revisión** | 5% | 10-15% | ⚠️ BAJO | +5-10% |
| **Cobertura Tests** | 0% | >80% | 🔴 CRÍTICO | +80% |
| **Ratio Revisión:Corrección** | 1:12.6 | 1:1 | 🔴 CRÍTICO | - |

---

### 2.2 Evolución en el Tiempo

```
Productividad (LOC/hora) - Tendencia

  45 |                    ●M2
     |               
  40 |         ●M5 ●M6    ●M3
     |            ●M10●M9
  35 |●M1         ●M8  ●M7
     |      ●M4
  30 |
     |_________________________________
       Sep       Oct        Nov

Interpretación: 
✅ Curva de aprendizaje positiva (+25% de Sep a Nov)
✅ Mayor productividad conforme aumenta familiaridad con stack
```

```
Densidad de Defectos (/KLOC) - Tendencia

  14 |              ●M9
     |
  12 |●M1 ●M2    ●M4    
     |          ●M5●M6●M8
  10 |              ●M7
     |    ●M3           ●M10
   8 |
     |_________________________________
       Sep       Oct        Nov

Interpretación:
⚠️ No hay mejora clara en el tiempo
⚠️ Densidad se mantiene entre 8-13 /KLOC (alta)
```

---

## 3. Lecciones Aprendidas

### 3.1 Lo Que Funcionó Bien ✅

#### 1. Arquitectura Modular
**Evidencia:**
- Separación clara Backend/Frontend
- Patrón MVC en backend
- Context API en frontend

**Impacto:**
- Facilidad para agregar nuevos módulos
- Reutilización de componentes (Navbar, Footer, AuthContext)
- Cambios aislados no rompen otras partes

**Acción:** Mantener y reforzar patrones arquitectónicos

---

#### 2. Documentación Técnica
**Evidencia:**
- `README.md` completo con setup
- `docs/API_CONTRACT.md` para endpoints
- `Git_workflow.md` para contribuciones

**Impacto:**
- Onboarding de nuevos desarrolladores más rápido
- Referencia para debugging
- Comunicación clara con stakeholders

**Acción:** Continuar documentando diseño ANTES de implementar

---

#### 3. Control de Versiones Disciplinado
**Evidencia:**
- Commits frecuentes con mensajes descriptivos
- Uso de branches para features
- Tags para releases

**Impacto:**
- Historial claro de cambios
- Rollback fácil si algo falla
- Rastreabilidad de bugs

**Acción:** Implementar convenciones de commits formales (Conventional Commits)

---

#### 4. Stack Tecnológico Adecuado
**Evidencia:**
- React + Vite para frontend (rápido)
- Express + MySQL para backend (escalable)
- TailwindCSS para estilos (productivo)

**Impacto:**
- Desarrollo ágil
- Ecosistema maduro con mucha documentación
- Performance aceptable

**Acción:** Mantenerse actualizado con versiones LTS

---

### 3.2 Lo Que NO Funcionó ❌

#### 1. Ausencia de Tests Automatizados
**Evidencia:**
- 0% cobertura de tests
- 67 defectos encontrados manualmente
- 101 hrs corrigiendo bugs (67% del proyecto)

**Impacto:**
- ❌ Regresiones frecuentes al cambiar código
- ❌ Debugging consume 2/3 del proyecto
- ❌ Miedo a refactorizar por romper algo

**Lección Aprendida:**
> "Un proyecto sin tests es deuda técnica acumulándose exponencialmente"

**Acción Correctiva:** Implementar TDD (Test-Driven Development)

---

#### 2. Testing Manual Insuficiente
**Evidencia:**
- Solo 10% del tiempo dedicado a testing
- Muchos bugs encontrados en producción por usuarios
- Sin checklist de testing

**Impacto:**
- ❌ Bugs escapan a producción
- ❌ Mala experiencia de usuario
- ❌ Reputación afectada

**Lección Aprendida:**
> "Testing no es una fase al final, es parte integral del desarrollo"

**Acción Correctiva:** Dedicar 20% del tiempo a testing sistemático

---

#### 3. Estimaciones sin Metodología
**Evidencia:**
- Error promedio del 20.7%
- Estimaciones "a ojo"
- Sin datos históricos consultados

**Impacto:**
- ⚠️ Deadlines incumplidos
- ⚠️ Stakeholders sin visibilidad real
- ⚠️ Sobre-compromiso de features

**Lección Aprendida:**
> "Sin PROBE, estás adivinando. Con PROBE, estás proyectando con base en datos"

**Acción Correctiva:** Aplicar PROBE en todos los módulos futuros

---

#### 4. Falta de Code Reviews
**Evidencia:**
- Solo 5% del tiempo en revisión
- Commits directos a develop sin PRs
- Bugs de lógica que pasaron desapercibidos

**Impacto:**
- ❌ Código de baja calidad se integra
- ❌ Defectos introducidos no se detectan temprano
- ❌ Falta de transferencia de conocimiento en el equipo

**Lección Aprendida:**
> "Dos pares de ojos encuentran el 90% de bugs que uno solo pasa por alto"

**Acción Correctiva:** PRs obligatorios + al menos 1 aprobación

---

#### 5. Debugging Reactivo (No Preventivo)
**Evidencia:**
- 101 hrs corrigiendo bugs (vs 8 hrs previniendo)
- Ratio revisión:corrección de 1:12.6 (meta: 1:1)

**Impacto:**
- 🔴 Costo de oportunidad: 83 hrs que pudieron usarse para features
- 🔴 Ciclo vicioso: más bugs → más presión → menos tiempo para prevenir

**Lección Aprendida:**
> "Una hora de code review ahorra 10 horas de debugging"

**Acción Correctiva:** Invertir tiempo al inicio (diseño + revisión) para ahorrar al final

---

### 3.3 Patrones de Defectos Recurrentes

| Patrón de Error | Frecuencia | Causa Raíz | Prevención |
|-----------------|------------|------------|------------|
| **Validación faltante** | 18 bugs | No considerar edge cases | Schema validation + tests unitarios |
| **SQL Injection** | 3 bugs | Queries concatenadas | Prepared statements siempre |
| **Auth bugs** | 8 bugs | Lógica de JWT compleja | Librería probada (passport.js) |
| **UI rota en móvil** | 12 bugs | No probar responsive | Testing en DevTools mobile view |
| **Race conditions** | 5 bugs | Asincronía mal manejada | Async/await + manejo de errores |
| **Null pointer** | 9 bugs | No validar props/params | TypeScript + PropTypes |
| **Regresiones** | 12 bugs | Cambios rompen funcionalidad existente | Tests de regresión automatizados |

**Top 3 Causas de Defectos:**
1. **Falta de validación** (27%)
2. **Testing insuficiente** (24%)
3. **Diseño apresurado** (18%)

---

## 4. Análisis de Causa Raíz (5 Whys)

### Problema: ¿Por qué hay 11.34 defectos/KLOC?

```
1. ¿Por qué hay tantos defectos?
   → Porque no se detectan temprano

2. ¿Por qué no se detectan temprano?
   → Porque no hay tests automatizados

3. ¿Por qué no hay tests automatizados?
   → Porque no se priorizó en el planning inicial

4. ¿Por qué no se priorizó?
   → Porque había presión por entregar features rápido

5. ¿Por qué había presión?
   → Porque las estimaciones no incluían tiempo de testing

CAUSA RAÍZ: 
Proceso de planning no incluye testing como parte integral del esfuerzo
```

**Solución:**
- ✅ PROBE debe incluir tiempo de testing (20% del esfuerzo total)
- ✅ Definition of Done incluye "tests escritos y pasando"
- ✅ No se considera "completo" hasta tener cobertura >80%

---

## 5. Plan de Mejora del Proceso Personal (PPIP)

### 5.1 Objetivos SMART para los Próximos 3 Meses

| # | Objetivo | Métrica Actual | Meta | Medición | Deadline |
|---|----------|----------------|------|----------|----------|
| 1 | **Reducir densidad de defectos** | 11.34 /KLOC | < 5 /KLOC | Defectos/KLOC | Feb 2026 |
| 2 | **Aumentar cobertura de tests** | 0% | 80% | Jest coverage report | Feb 2026 |
| 3 | **Mejorar precisión de estimaciones** | 20.7% error | < 15% error | PROBE tracking | Feb 2026 |
| 4 | **Aumentar tiempo de revisión** | 5% | 15% | Time tracking | Ene 2026 |
| 5 | **Implementar CI/CD** | ❌ No | ✅ Sí | GitHub Actions activo | Dic 2025 |
| 6 | **PRs obligatorios** | 0% commits | 100% commits | Git log | Dic 2025 |

---

### 5.2 Plan de Acción Detallado

#### Prioridad 1: CRÍTICA (Próximas 2 semanas)

##### Acción 1.1: Setup de Tests Automatizados

**Tarea:** Configurar Jest para backend

**Pasos:**
```bash
1. cd .vscode
2. npm install --save-dev jest supertest
3. Crear .vscode/jest.config.js
4. Agregar script en package.json: "test": "jest --coverage"
5. Escribir primer test para /api/saludo
6. Ejecutar: npm test
```

**Criterio de Éxito:** Al menos 1 test pasando

**Responsable:** [Tu Nombre]

**Esfuerzo Estimado:** 4 horas

**Deadline:** 16 de noviembre de 2025

---

##### Acción 1.2: Configurar GitHub Actions CI

**Tarea:** Automatizar ejecución de tests en cada push

**Pasos:**
```yaml
1. Crear .github/workflows/backend.yml
2. Configurar job para:
   - npm ci
   - npm run lint
   - npm test
3. Verificar que corre en cada PR
```

**Criterio de Éxito:** Badge "passing" en README

**Responsable:** [Tu Nombre]

**Esfuerzo Estimado:** 3 horas

**Deadline:** 18 de noviembre de 2025

---

##### Acción 1.3: Política de PRs Obligatorios

**Tarea:** Proteger branches main y develop

**Pasos:**
```
1. GitHub → Settings → Branches
2. Agregar regla para "main":
   - Require PR reviews (1 approval)
   - Require status checks (CI must pass)
   - No direct pushes
3. Repetir para "develop"
```

**Criterio de Éxito:** Imposible hacer push directo a main

**Responsable:** [Tu Nombre]

**Esfuerzo Estimado:** 1 hora

**Deadline:** 15 de noviembre de 2025

---

#### Prioridad 2: ALTA (Próximas 4 semanas)

##### Acción 2.1: Escribir Tests para Módulos Existentes

**Tarea:** Alcanzar 60% de cobertura

**Plan:**
| Semana | Módulos a Testear | Tests Estimados | Esfuerzo |
|--------|-------------------|-----------------|----------|
| 1 | Auth + Clientes | 25 tests | 8 hrs |
| 2 | Propiedades + Imágenes | 30 tests | 10 hrs |
| 3 | Contratos + Visitas | 28 tests | 9 hrs |
| 4 | Dashboard + Reportes | 22 tests | 7 hrs |

**Criterio de Éxito:** `npm test -- --coverage` muestra >60%

**Responsable:** [Tu Nombre]

**Deadline:** 15 de diciembre de 2025

---

##### Acción 2.2: Implementar Método PROBE

**Tarea:** Aplicar PROBE en próximos 3 módulos

**Proceso:**
```
Para cada módulo nuevo:
1. Identificar módulos proxy similares
2. Calcular LOC estimado (promedio ponderado)
3. Calcular tiempo estimado (LOC / productividad)
4. Incluir factor de ajuste (+20% si alta complejidad)
5. Registrar estimación en Google Sheets
6. Al finalizar: comparar real vs estimado
7. Calcular error y ajustar factores
```

**Criterio de Éxito:** Error <15% en promedio

**Responsable:** [Tu Nombre]

**Deadline:** 15 de enero de 2026

---

##### Acción 2.3: Aumentar Tiempo de Code Review

**Tarea:** Revisar TODO el código antes de merge

**Proceso:**
```
1. Developer crea PR con template completo
2. Asignar reviewer
3. Reviewer dedica 15-30 min a:
   - Leer código línea por línea
   - Verificar lógica
   - Buscar edge cases no considerados
   - Sugerir mejoras de diseño
4. Developer aplica feedback
5. Re-review hasta aprobar
6. Solo entonces: Merge
```

**Métrica:** Promedio 20 min de review por PR

**Criterio de Éxito:** 15% del tiempo total en revisión

**Responsable:** [Tu Nombre + Peer]

**Deadline:** 1 de diciembre de 2025

---

#### Prioridad 3: MEDIA (Próximos 3 meses)

##### Acción 3.1: Migrar a TypeScript (Gradual)

**Razón:** Prevenir bugs de tipo en compile-time

**Plan:**
```
Mes 1: Configurar TS en proyecto
Mes 2: Migrar 30% del código (módulos nuevos primero)
Mes 3: Migrar 60% del código
```

**Criterio de Éxito:** TypeScript compilando sin errores

**Responsable:** [Tu Nombre]

**Deadline:** 15 de febrero de 2026

---

##### Acción 3.2: Implementar Error Monitoring

**Herramienta:** Sentry

**Beneficio:** Detectar bugs en producción automáticamente

**Pasos:**
```
1. Crear cuenta en sentry.io
2. npm install @sentry/node (backend)
3. npm install @sentry/react (frontend)
4. Configurar DSN en .env
5. Wrappear app con Sentry.init()
6. Verificar errores aparecen en dashboard
```

**Criterio de Éxito:** Errores de producción visibles en Sentry

**Responsable:** [Tu Nombre]

**Esfuerzo Estimado:** 4 horas

**Deadline:** 1 de enero de 2026

---

##### Acción 3.3: Retrospectivas Quincenales

**Objetivo:** Aprendizaje continuo

**Agenda (30 minutos):**
```
1. ¿Qué salió bien? (10 min)
2. ¿Qué salió mal? (10 min)
3. Acciones concretas de mejora (10 min)
```

**Documentación:** Bitácora en `docs/PSP/Retrospectivas/`

**Criterio de Éxito:** 1 retrospectiva cada 2 semanas

**Responsable:** [Tu Nombre]

**Deadline:** Recurrente (inicio: 20 nov 2025)

---

### 5.3 Cronograma Visual

```
Noviembre 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Semana 1-2:
  ✅ Setup Jest + GitHub Actions
  ✅ PRs obligatorios
  ✅ Primera retrospectiva

Diciembre 2025
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Semana 1-4:
  ⏳ Escribir tests (meta: 60% cobertura)
  ⏳ Aplicar PROBE en 2 módulos nuevos
  ⏳ Code reviews en 100% de PRs
  ✅ Setup Sentry

Enero 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Semana 1-4:
  ⏳ Continuar tests (meta: 70% cobertura)
  ⏳ Refinar estimaciones PROBE
  ⏳ Iniciar migración a TypeScript
  ✅ Retrospectiva mensual

Febrero 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Semana 1-2:
  ⏳ Alcanzar 80% cobertura
  ⏳ Evaluar métricas finales
  ✅ Reporte PPIP de progreso
```

---

### 5.4 Métricas de Seguimiento

#### Dashboard de Progreso (Actualizar semanalmente)

| Métrica | Semana 1 | Semana 4 | Semana 8 | Semana 12 | Meta | Estado |
|---------|----------|----------|----------|-----------|------|--------|
| Cobertura Tests | 0% | 25% | 50% | 80% | 80% | 🟡 |
| Densidad Defectos | 11.34 | 9.5 | 7.0 | 5.0 | <5 | 🟡 |
| Error Estimación | 20.7% | 18% | 16% | 14% | <15% | 🟡 |
| Tiempo Revisión | 5% | 10% | 12% | 15% | 15% | 🟡 |
| PRs con Aprobación | 0% | 80% | 95% | 100% | 100% | 🟡 |

**Leyenda:**
- 🟢 = Meta alcanzada
- 🟡 = En progreso
- 🔴 = Retrasado

---

## 6. Gestión de Riesgos del Plan

### 6.1 Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| **Falta de tiempo para escribir tests** | Alta | Alto | Time-boxing: 2 hrs diarias dedicadas a tests |
| **Resistencia al cambio (PRs obligatorios)** | Media | Medio | Training + mostrar beneficios con data |
| **Curva de aprendizaje de TypeScript** | Media | Bajo | Migración gradual, empezar por módulos nuevos |
| **Overhead de reviews ralentiza desarrollo** | Alta | Medio | Set expectativa: calidad > velocidad |
| **Burnout por sobrecarga de mejoras** | Media | Alto | Priorizar: hacer cambios incrementales |

---

### 6.2 Señales de Alerta Temprana

```
🚨 Si en 2 semanas:
   - Cobertura de tests sigue en 0%
   - No se ha hecho ningún PR con review
   - Error de estimación sube a >25%

ACCIÓN: 
   → Pausar desarrollo de features nuevas
   → Enfocarse 100% en establecer proceso
   → Pedir ayuda/mentoría externa
```

---

## 7. Compromiso Personal

### Declaración de Compromiso

> **Yo, [Tu Nombre], me comprometo a:**
> 
> 1. ✅ Registrar tiempo en Clockify **DIARIAMENTE** sin excepción
> 2. ✅ Escribir tests **ANTES** de considerar una feature "completa"
> 3. ✅ Aplicar PROBE a **TODO** módulo nuevo (sin estimaciones "a ojo")
> 4. ✅ Hacer code review de **AL MENOS 30 minutos** por cada PR
> 5. ✅ Conducir retrospectivas **CADA 2 SEMANAS** sin saltarlas
> 6. ✅ Actualizar métricas PSP **SEMANALMENTE** en Google Sheets
> 7. ✅ No hacer commits directos a main/develop (solo PRs)
> 8. ✅ Dedicar **20% del tiempo** a testing (no negociable)
>
> **Si incumplo:** Analizar por qué y documentar en retrospectiva

**Firma:** ___________________  
**Fecha:** 12 de noviembre de 2025

---

## 8. Métricas de Éxito del PPIP

### Criterios de Éxito (a 3 meses)

**Meta Mínima Aceptable:**
- [ ] Densidad de defectos < 7 /KLOC (reducción del 38%)
- [ ] Cobertura de tests > 60%
- [ ] Error de estimación < 18%

**Meta Objetivo:**
- [ ] Densidad de defectos < 5 /KLOC (reducción del 56%)
- [ ] Cobertura de tests > 80%
- [ ] Error de estimación < 15%

**Meta Aspiracional:**
- [ ] Densidad de defectos < 3 /KLOC (reducción del 73%)
- [ ] Cobertura de tests > 90%
- [ ] Error de estimación < 10%

---

## 9. Revisión y Retroalimentación

### 9.1 Revisión Mensual

**Fecha:** Primer lunes de cada mes

**Agenda:**
```
1. Revisar dashboard de métricas PSP
2. Comparar progreso vs plan
3. Identificar desviaciones
4. Ajustar acciones si es necesario
5. Celebrar logros (por pequeños que sean)
```

**Documentación:** Crear `Revision_Mensual_AAAA_MM.md`

---

### 9.2 Revisión Trimestral Completa

**Fecha:** 15 de febrero de 2026

**Entregable:** Nuevo documento PPIP v2.0 con:
- [ ] Comparación de métricas antes/después
- [ ] Gráficos de evolución
- [ ] Cálculo de ROI de mejoras
- [ ] Nuevas acciones para siguiente trimestre

---

## 10. Recursos y Soporte

### 10.1 Recursos de Aprendizaje

| Tema | Recurso | Prioridad | Tiempo Estimado |
|------|---------|-----------|-----------------|
| **TDD** | Kent Beck - "Test Driven Development" | Alta | 12 hrs lectura |
| **PSP** | Humphrey - "A Discipline for Software Engineering" | Alta | 20 hrs lectura |
| **Jest** | Documentación oficial + tutoriales | Alta | 8 hrs práctica |
| **TypeScript** | "TypeScript Deep Dive" (Basarat) | Media | 15 hrs |
| **Clean Code** | Robert Martin - "Clean Code" | Media | 10 hrs lectura |

---

### 10.2 Mentoría y Soporte

**Mentor:** [Nombre del instructor/líder técnico]

**Frecuencia de sesiones:** Quincenal (30 min)

**Temas a discutir:**
- Revisión de métricas PSP
- Obstáculos encontrados
- Feedback sobre código
- Ajustes al plan

---

## 11. Reflexión Final

### ¿Qué he aprendido sobre mí como desarrollador?

**Fortalezas que confirmé:**
- ✅ Soy disciplinado con control de versiones
- ✅ Aprendo rápido nuevas tecnologías
- ✅ Mantengo arquitecturas limpias

**Debilidades que descubrí:**
- ❌ Subestimo consistentemente el tiempo necesario (optimismo)
- ❌ Tengo mentalidad de "primero hago que funcione, luego tests" (nunca llega "luego")
- ❌ Me cuesta decir "no" a features nuevas para enfocarme en calidad

**Cambio de Mentalidad Necesario:**

```
ANTES:
"Testing es algo que haces al final si tienes tiempo"
    ↓
AHORA:
"Testing es parte integral del desarrollo, no un opcional"

ANTES:
"Estimaciones son solo adivinanzas educadas"
    ↓
AHORA:
"Estimaciones con PROBE son proyecciones basadas en datos"

ANTES:
"Code review es pérdida de tiempo, yo reviso mi código"
    ↓
AHORA:
"Code review es inversión que ahorra 10x tiempo de debugging"
```

---

### ¿Cómo me veo en 6 meses?

**Visión Personal:**

> En 6 meses, seré un desarrollador que:
> - Escribe tests ANTES de implementar (TDD)
> - Estima con precisión <10% de error usando PROBE
> - Produce código con densidad de defectos <2 /KLOC
> - Documenta decisiones arquitectónicas sistemáticamente
> - Hace code review constructivo y detallado
> - Mide TODO (tiempo, defectos, productividad) para mejorar continuamente

**Indicador de Éxito:**
```
Cuando un stakeholder me pregunte "¿Cuánto tardará X?",
podré responder con confianza:
"Basado en módulos similares A y B, estimo Z horas con ±15% de margen"

Y cuando entregue, el error real sea <10%.
```

---

## 12. Conclusión

El Personal Software Process no es solo un conjunto de métricas, es un **cambio de mentalidad**:

- De **reactivo** (corregir bugs) a **preventivo** (diseñar bien desde el inicio)
- De **subjetivo** ("creo que está bien") a **objetivo** (datos medibles)
- De **individual** (solo mi código) a **colaborativo** (code reviews)
- De **entregar rápido** a **entregar bien** (calidad sostenible)

Este PPIP no es un documento estático, es un **contrato conmigo mismo** para convertirme en un desarrollador más profesional y efectivo.

**La mejora continua no es un evento, es un hábito.**

---

**Elaborado por:** [Tu Nombre]  
**Revisado por:** [Instructor/Mentor]  
**Fecha:** 12 de noviembre de 2025  
**Versión:** 1.0  
**Próxima Revisión:** 15 de diciembre de 2025

---

> **"La medición no es el enemigo del desarrollo ágil, es su aliado. Lo que no se mide, no se puede mejorar."**  
> — Watts Humphrey, creador del PSP

---

## Anexos

### Anexo A: Plantilla de Retrospectiva Quincenal

```markdown
# Retrospectiva Quincenal - [Fecha]

## ¿Qué salió bien?
- [Item 1]
- [Item 2]

## ¿Qué salió mal?
- [Item 1]
- [Item 2]

## Métricas del período:
- Productividad: X LOC/hr
- Defectos: Y
- Tiempo testing: Z%

## Acciones para próximas 2 semanas:
- [ ] Acción 1
- [ ] Acción 2
```

---

### Anexo B: Checklist de Definition of Done

```
Feature completada cuando:
- [ ] Código escrito y funcional
- [ ] Tests unitarios escritos (>80% cobertura del módulo)
- [ ] Tests de integración escritos
- [ ] Code review aprobado por al menos 1 peer
- [ ] CI pasando (linting + tests)
- [ ] Documentación actualizada (README, API docs)
- [ ] Sin warnings de ESLint
- [ ] Probado manualmente en dev
- [ ] Merged a develop (no a main directamente)
```

---

**FIN DEL DOCUMENTO PPIP**
