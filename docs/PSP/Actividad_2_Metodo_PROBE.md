# ACTIVIDAD 2: Método PROBE (Proxy-Based Estimating)
## Personal Software Process (PSP) - InmoGestión

**Equipo:** [Nombres del equipo]  
**Proyecto:** InmoGestión - Sistema de Gestión Inmobiliaria  
**Fecha:** 12 de noviembre de 2025

---

## 1. Introducción al Método PROBE

### ¿Qué es PROBE?

**PROBE** (Proxy-Based Estimating) es un método de estimación de software que utiliza datos históricos de proyectos anteriores como **proxy** (sustituto) para predecir el tamaño y esfuerzo de nuevos módulos.

**Principio fundamental:**  
*"Los programas similares requieren un esfuerzo similar"*

### Ventajas de PROBE

✅ **Basado en datos reales:** No depende de intuición, sino de métricas históricas  
✅ **Mejora continua:** Cada proyecto aporta datos para futuras estimaciones  
✅ **Precisión incremental:** Las estimaciones mejoran con más datos históricos  
✅ **Cuantificable:** Permite medir el error de estimación

---

## 2. Datos Históricos del Proyecto InmoGestión

### 2.1 Módulos Completados (Base de Datos Histórica)

A continuación se presenta la data histórica real extraída del proyecto InmoGestión:

| ID | Módulo | Tipo | LOC Backend | LOC Frontend | LOC Total | Tiempo Real (hrs) | Defectos Encontrados |
|----|--------|------|-------------|--------------|-----------|-------------------|----------------------|
| M1 | Sistema de Autenticación | CRUD + Seguridad | 350 | 280 | 630 | 18 | 8 |
| M2 | Gestión de Propiedades | CRUD Completo | 520 | 450 | 970 | 22 | 12 |
| M3 | Módulo de Clientes | CRUD Básico | 280 | 320 | 600 | 14 | 5 |
| M4 | Sistema de Imágenes | Upload + CRUD | 180 | 150 | 330 | 10 | 4 |
| M5 | Contratos Documentos (PDF) | Lógica Compleja | 420 | 380 | 800 | 20 | 9 |
| M6 | Dashboard Admin | Reportes | 450 | 520 | 970 | 24 | 11 |
| M7 | Localidades y Barrios | CRUD Simple | 120 | 90 | 210 | 6 | 2 |
| M8 | Sistema de Visitas | CRUD + Lógica | 310 | 280 | 590 | 16 | 7 |
| M9 | Interacciones Cliente | CRUD + Notif | 240 | 220 | 460 | 12 | 6 |
| M10 | Recuperación Contraseña | Email + JWT | 190 | 160 | 350 | 9 | 3 |

**Totales Acumulados:**
- **LOC Total Backend:** 3,060 líneas
- **LOC Total Frontend:** 2,850 líneas
- **LOC Total Proyecto:** 5,910 líneas
- **Tiempo Total Invertido:** 151 horas
- **Defectos Totales:** 67 defectos

---

### 2.2 Métricas Calculadas (Datos Históricos)

#### Productividad Promedio
```
Productividad = LOC Total / Tiempo Total
Productividad = 5,910 / 151 = 39.14 LOC/hora
```

#### Densidad de Defectos Promedio
```
Densidad de Defectos = Defectos / (LOC / 1000)
Densidad de Defectos = 67 / (5,910 / 1000) = 11.34 defectos/KLOC
```

#### Tiempo Promedio por Tipo de Módulo

| Tipo de Módulo | LOC Promedio | Tiempo Promedio | Productividad |
|----------------|--------------|-----------------|---------------|
| CRUD Básico | 405 | 10 hrs | 40.5 LOC/hr |
| CRUD Completo | 853 | 20 hrs | 42.7 LOC/hr |
| Lógica Compleja | 800 | 20 hrs | 40.0 LOC/hr |
| CRUD + Lógica | 525 | 14 hrs | 37.5 LOC/hr |
| Upload/Archivos | 330 | 10 hrs | 33.0 LOC/hr |

---

## 3. Aplicación del Método PROBE

### 3.1 Nuevo Módulo a Estimar: **Sistema de Pagos Online**

**Requerimientos:**
- Integración con pasarela de pagos (Stripe/MercadoPago)
- CRUD de transacciones
- Historial de pagos por cliente
- Notificaciones por email
- Dashboard de reportes de ingresos
- Webhooks para actualización de estado

**Complejidad estimada:** CRUD + Lógica Compleja + Integración Externa

---

### 3.2 Identificación de Módulos Similares (Proxy)

Buscamos en nuestra base de datos histórica módulos con características similares:

| Módulo Histórico | Similitud | LOC | Tiempo (hrs) | Razón de Similitud |
|------------------|-----------|-----|--------------|---------------------|
| M5: Contratos PDF | 85% | 800 | 20 | Lógica compleja + integración externa (Puppeteer) |
| M8: Sistema Visitas | 70% | 590 | 16 | CRUD + lógica de negocio + notificaciones |
| M2: Gestión Propiedades | 65% | 970 | 22 | CRUD completo + reportes |
| M6: Dashboard Admin | 60% | 970 | 24 | Reportes + visualización de datos |

**Proxy seleccionado:** Promedio ponderado de M5 (50%) + M8 (30%) + M2 (20%)

---

### 3.3 Estimación de Tamaño (LOC)

#### Método 1: Promedio Ponderado de Proxy

```
LOC Estimado = (LOC_M5 × 0.5) + (LOC_M8 × 0.3) + (LOC_M2 × 0.2)
LOC Estimado = (800 × 0.5) + (590 × 0.3) + (970 × 0.2)
LOC Estimado = 400 + 177 + 194 = 771 LOC
```

#### Método 2: Regresión Lineal Simple

Basado en la correlación histórica entre complejidad y LOC:

```
LOC = Base + (Complejidad × Factor)

Donde:
- Base = 200 (LOC base para cualquier módulo)
- Complejidad = 8/10 (alta complejidad)
- Factor = 70 (LOC por punto de complejidad)

LOC Estimado = 200 + (8 × 70) = 760 LOC
```

#### Estimación Final (Promedio de Métodos)

```
LOC Estimado = (771 + 760) / 2 = 765 LOC
```

**Desglose Backend/Frontend** (proporción histórica 52% / 48%):
- **Backend:** 765 × 0.52 = **398 LOC**
- **Frontend:** 765 × 0.48 = **367 LOC**

---

### 3.4 Estimación de Esfuerzo (Tiempo)

#### Opción 1: Basado en Productividad Histórica

```
Tiempo = LOC Estimado / Productividad Promedio
Tiempo = 765 / 39.14 = 19.5 horas
```

#### Opción 2: Promedio Ponderado de Proxy

```
Tiempo = (Tiempo_M5 × 0.5) + (Tiempo_M8 × 0.3) + (Tiempo_M2 × 0.2)
Tiempo = (20 × 0.5) + (16 × 0.3) + (22 × 0.2)
Tiempo = 10 + 4.8 + 4.4 = 19.2 horas
```

#### Estimación Final con Factor de Ajuste

**Factor de ajuste:** +15% (complejidad de integración externa con APIs de pago)

```
Tiempo Estimado = 19.5 × 1.15 = 22.4 horas ≈ 22.5 horas
```

**Desglose por Fase:**

| Fase | % Tiempo | Horas Estimadas |
|------|----------|-----------------|
| Análisis y Diseño | 15% | 3.4 hrs |
| Implementación Backend | 30% | 6.8 hrs |
| Implementación Frontend | 25% | 5.6 hrs |
| Integración API Pagos | 15% | 3.4 hrs |
| Testing y Debugging | 10% | 2.3 hrs |
| Documentación | 5% | 1.0 hrs |
| **TOTAL** | **100%** | **22.5 hrs** |

---

### 3.5 Estimación de Defectos

Basado en la densidad histórica de defectos:

```
Defectos Estimados = (LOC Estimado / 1000) × Densidad Promedio
Defectos Estimados = (765 / 1000) × 11.34 = 8.67 ≈ 9 defectos
```

**Distribución esperada de defectos:**
- **Críticos:** 2 (22%)
- **Altos:** 3 (33%)
- **Medios:** 3 (33%)
- **Bajos:** 1 (11%)

---

## 4. Tabla PROBE Completa

### Resumen de Estimación - Módulo Sistema de Pagos

| Métrica | Valor Estimado | Método Aplicado | Confianza |
|---------|----------------|-----------------|-----------|
| **LOC Total** | 765 | Promedio ponderado + Regresión | 85% |
| **LOC Backend** | 398 | Proporción histórica (52%) | 80% |
| **LOC Frontend** | 367 | Proporción histórica (48%) | 80% |
| **Tiempo Total** | 22.5 hrs | Productividad + ajuste 15% | 75% |
| **Defectos Estimados** | 9 | Densidad histórica | 70% |
| **Productividad Esperada** | 34 LOC/hr | 765 / 22.5 | 75% |

### Intervalo de Confianza (±20%)

| Métrica | Mínimo | Estimado | Máximo |
|---------|--------|----------|--------|
| LOC | 612 | 765 | 918 |
| Tiempo (hrs) | 18 | 22.5 | 27 |
| Defectos | 7 | 9 | 11 |

---

## 5. Plan de Seguimiento

### 5.1 Tracking Durante Desarrollo

Durante la implementación del módulo, registraremos:

| Dato a Registrar | Herramienta | Frecuencia |
|------------------|-------------|------------|
| Tiempo invertido | Clockify / Toggl | Diario |
| LOC real escritas | VSCode Counter | Al completar cada archivo |
| Defectos encontrados | GitHub Issues | Al detectar cada bug |
| Dificultades técnicas | Bitácora de desarrollo | Diario |

### 5.2 Comparación Real vs Estimado

Al finalizar el módulo, completaremos esta tabla:

| Métrica | Estimado PROBE | Real | Error | Error % |
|---------|----------------|------|-------|---------|
| LOC Total | 765 | ___ | ___ | ___ |
| Tiempo (hrs) | 22.5 | ___ | ___ | ___ |
| Defectos | 9 | ___ | ___ | ___ |
| Productividad | 34 LOC/hr | ___ | ___ | ___ |

**Fórmula de Error:**
```
Error % = |(Real - Estimado) / Estimado| × 100
```

---

## 6. Mejora Continua del Método PROBE

### 6.1 Actualización de Base de Datos Histórica

Una vez completado el módulo de **Sistema de Pagos**, agregaremos:

| ID | Módulo | LOC | Tiempo | Defectos |
|----|--------|-----|--------|----------|
| M11 | Sistema de Pagos | [REAL] | [REAL] | [REAL] |

Esto mejorará las futuras estimaciones al tener más datos de módulos con integración externa.

### 6.2 Calibración de Factores

Si el error es significativo (>25%), ajustaremos:

- **Factor de productividad** si LOC/hora varió mucho
- **Factor de complejidad** si el esfuerzo fue subestimado/sobreestimado
- **Densidad de defectos** si encontramos muchos más bugs de lo esperado

### 6.3 Lecciones Aprendidas

Documentaremos:
- ¿Qué causó las desviaciones?
- ¿Qué supuestos fueron incorrectos?
- ¿Qué factores no consideramos?

---

## 7. Caso de Estudio 2: Módulo de Chat en Tiempo Real

### Especificación

**Requerimientos:**
- WebSockets para comunicación en tiempo real
- Chat 1-a-1 entre Cliente y Agente
- Historial de conversaciones
- Notificaciones push
- Indicador de "escribiendo..."
- Almacenamiento en BD de mensajes

**Complejidad:** Alta (tecnología nueva: WebSockets)

---

### Módulos Proxy Identificados

| Módulo Histórico | Similitud | LOC | Tiempo | Justificación |
|------------------|-----------|-----|--------|---------------|
| M9: Interacciones Cliente | 50% | 460 | 12 | Comunicación cliente-sistema |
| M8: Sistema Visitas | 40% | 590 | 16 | Lógica de negocio + notificaciones |
| M1: Autenticación | 30% | 630 | 18 | Manejo de sesiones en tiempo real |

---

### Estimación PROBE

**LOC Estimado:**
```
LOC = (460 × 0.5) + (590 × 0.4) + (630 × 0.3)
LOC = 230 + 236 + 189 = 655 LOC

Ajuste por tecnología nueva (+25%):
LOC Final = 655 × 1.25 = 819 LOC
```

**Tiempo Estimado:**
```
Tiempo base = 819 / 39.14 = 20.9 hrs
Factor de aprendizaje WebSockets (+30%) = 20.9 × 1.30 = 27.2 hrs
```

**Defectos Estimados:**
```
Defectos = (819 / 1000) × 11.34 × 1.2 = 11.2 ≈ 11 defectos
(Factor 1.2 por tecnología nueva)
```

---

## 8. Tabla Comparativa de Estimaciones

### Múltiples Módulos Futuros

| Módulo Futuro | Proxy Principal | LOC Est. | Tiempo Est. | Defectos Est. | Confianza |
|---------------|-----------------|----------|-------------|---------------|-----------|
| Sistema de Pagos | M5 (Contratos PDF) | 765 | 22.5 hrs | 9 | 85% |
| Chat en Tiempo Real | M9 (Interacciones) | 819 | 27.2 hrs | 11 | 70% |
| Sistema de Notificaciones | M8 (Visitas) | 520 | 15.0 hrs | 6 | 90% |
| Integración WhatsApp | M10 (Recuperación) | 680 | 19.5 hrs | 8 | 75% |
| Sistema de Auditoría | M6 (Dashboard) | 850 | 24.0 hrs | 10 | 80% |

---

## 9. Gráficos y Visualizaciones

### 9.1 Correlación LOC vs Tiempo

```
Gráfico de Dispersión: Datos Históricos

Tiempo (hrs)
    25 |                  M6 ●
       |               M2 ●
    20 |          M5 ●
       |       M8 ●
    15 |    M3 ●
       | M9 ●
    10 | M4 ●  M10 ●
       | M7 ●
     5 |
       |_________________________ LOC
         200  400  600  800  1000

Ecuación de regresión:
Tiempo = 3.5 + (0.020 × LOC)
R² = 0.89 (correlación fuerte)
```

### 9.2 Distribución de Defectos por Módulo

```
Defectos

  12 |     ██
     |     ██
  10 |     ██  ██
     |     ██  ██
   8 | ██  ██  ██
     | ██  ██  ██
   6 | ██  ██  ██  ██
     | ██  ██  ██  ██
   4 | ██  ██  ██  ██  ██
     | ██  ██  ██  ██  ██  ██
   2 | ██  ██  ██  ██  ██  ██  ██  ██
     |_____________________________
       M1  M2  M3  M4  M5  M6  M7  M8  M9  M10
```

### 9.3 Precisión de Estimaciones (Actualizar post-implementación)

```
Error Absoluto Medio (MAE) por Módulo

Error %
  30 |
     |
  20 |    [Completar con datos reales]
     |
  10 |
     |
   0 |_________________________ Módulos
       M1   M2   M3   M4   M5 ...

Meta: MAE < 15%
```

---

## 10. Conclusiones

### 10.1 Beneficios del Método PROBE

✅ **Estimaciones fundamentadas:** Ya no estimamos "a ojo", sino con datos reales  
✅ **Trazabilidad:** Podemos justificar cada número ante stakeholders  
✅ **Mejora continua:** Cada módulo mejora nuestras futuras estimaciones  
✅ **Identificación temprana de riesgos:** Si un módulo es muy diferente a los anteriores, lo detectamos antes

### 10.2 Limitaciones Identificadas

⚠️ **Datos históricos limitados:** Solo tenemos 10 módulos, idealmente necesitamos >20  
⚠️ **Variabilidad en complejidad:** Algunos módulos son muy únicos  
⚠️ **Factor humano:** Cambios de equipo o nivel de experiencia afectan productividad  
⚠️ **Tecnologías nuevas:** Requieren factores de ajuste subjetivos

### 10.3 Recomendaciones

1. ✅ **Registrar TODO:** Tiempo, LOC, defectos de cada módulo futuro
2. ✅ **Revisar estimaciones:** Comparar estimado vs real cada 2 semanas
3. ✅ **Ajustar factores:** Calibrar productividad y complejidad trimestralmente
4. ✅ **Documentar supuestos:** Anotar por qué elegimos ciertos proxy
5. ✅ **Usar intervalos:** Siempre dar un rango (mejor caso - peor caso)

---

## 11. Plantilla para Nuevas Estimaciones

### Formato Estándar de Estimación PROBE

```
MÓDULO: [Nombre del módulo]
FECHA ESTIMACIÓN: [DD/MM/AAAA]
RESPONSABLE: [Nombre]

1. DESCRIPCIÓN:
   [Breve resumen de funcionalidades]

2. COMPLEJIDAD: [Baja / Media / Alta]

3. PROXY SELECCIONADOS:
   - Módulo 1: [Nombre] (similitud: X%, peso: Y%)
   - Módulo 2: [Nombre] (similitud: X%, peso: Y%)

4. ESTIMACIÓN LOC:
   - Backend: ___ LOC
   - Frontend: ___ LOC
   - Total: ___ LOC

5. ESTIMACIÓN TIEMPO:
   - Análisis: ___ hrs
   - Implementación: ___ hrs
   - Testing: ___ hrs
   - Total: ___ hrs

6. ESTIMACIÓN DEFECTOS: ___ defectos

7. FACTORES DE AJUSTE:
   - [Factor 1]: +X%
   - [Factor 2]: -Y%

8. INTERVALO DE CONFIANZA:
   - LOC: [Min - Max]
   - Tiempo: [Min - Max]

9. RIESGOS IDENTIFICADOS:
   - [Riesgo 1]
   - [Riesgo 2]

10. PLAN DE SEGUIMIENTO:
    - Herramienta tracking: ___
    - Frecuencia de medición: ___
```

---

## 12. Próximos Pasos

1. ✅ **Implementar time tracking:** Usar Clockify para medir tiempo real
2. ✅ **Crear issues template:** Estandarizar registro de defectos en GitHub
3. ✅ **Actualizar base de datos:** Agregar módulos completados al registro histórico
4. ✅ **Validar estimaciones:** Al finalizar cada módulo, calcular error %
5. ✅ **Iterar método:** Refinar factores de ajuste basados en errores previos

---

**Elaborado por:** [Equipo de desarrollo]  
**Revisado por:** [Líder de proyecto]  
**Fecha:** 12 de noviembre de 2025  
**Versión:** 1.0

---

> **Nota:** Este documento es un entregable vivo. Se actualizará conforme se completen módulos y se obtengan datos reales de implementación.
