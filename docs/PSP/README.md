# 📚 Personal Software Process (PSP) - InmoGestión

**Proyecto:** InmoGestión - Sistema de Gestión Inmobiliaria  
**Fecha:** 12 de noviembre de 2025  
**Repositorio:** https://github.com/tiquesebastian/InmoGestion

---

## 📖 Índice de Documentos PSP

Esta carpeta contiene toda la documentación del Personal Software Process aplicado al proyecto InmoGestión.

### 🎯 Documento de Inicio Rápido

👉 **[RESUMEN_ENTREGABLES.md](RESUMEN_ENTREGABLES.md)** ← Empieza aquí

Este documento proporciona:
- Checklist de actividades completadas
- Resumen ejecutivo de cada entregable
- Métricas clave del proyecto
- Guía de navegación

---

## 📋 Actividades Individuales

### 📄 Actividad 1: Diagnóstico Personal de Proceso

**Archivo:** [Actividad_1_Diagnostico_Personal_Proceso.md](Actividad_1_Diagnostico_Personal_Proceso.md)

**Contenido:**
- Descripción completa del proceso de desarrollo actual (7 fases)
- Diagrama de flujo del proceso personal
- Análisis FODA completo
- Conclusiones y reflexión personal

**Páginas:** ~20  
**Tiempo de lectura:** 30 minutos

---

### 📊 Actividad 3: Evaluación del Desempeño Personal

**Archivo:** [Actividad_3_Evaluacion_Desempeno_Personal.md](Actividad_3_Evaluacion_Desempeno_Personal.md)

**Contenido:**
- Métricas de productividad (LOC/hora)
- Métricas de calidad (densidad de defectos)
- Distribución del tiempo por fase
- Precisión de estimaciones
- Gráficos comparativos
- Plan de mejora con metas SMART

**Páginas:** ~30  
**Tiempo de lectura:** 45 minutos

---

### 🎯 Actividad 5: Personal Process Improvement Plan (PPIP)

**Archivo:** [Actividad_5_PPIP_Plan_Mejora.md](Actividad_5_PPIP_Plan_Mejora.md)

**Contenido:**
- Revisión de resultados del proyecto
- Lecciones aprendidas (¿Qué funcionó? ¿Qué no?)
- Análisis de causa raíz (5 Whys)
- Plan de acción detallado (prioridades 1, 2, 3)
- Objetivos SMART para 3 meses
- Compromiso personal
- Reflexión final

**Páginas:** ~35  
**Tiempo de lectura:** 50 minutos

---

## 👥 Actividades Grupales

### 📐 Actividad 2: Método PROBE

**Archivo:** [Actividad_2_Metodo_PROBE.md](Actividad_2_Metodo_PROBE.md)

**Contenido:**
- Introducción al método PROBE
- Base de datos histórica (10 módulos completados)
- Aplicación de PROBE a módulos nuevos
- Estimación de LOC, tiempo y defectos
- Gráficos de correlación
- Plantilla para nuevas estimaciones

**Páginas:** ~25  
**Tiempo de lectura:** 40 minutos

---

### 🛠️ Actividad 4: Herramientas Informáticas de Apoyo

**Archivo:** [Actividad_4_Herramientas_Informaticas.md](Actividad_4_Herramientas_Informaticas.md)

**Contenido:**
- Stack de 8 herramientas PSP
- Time Tracking con Clockify
- Defect Tracking con GitHub Issues
- Version Control con Git
- Project Management con GitHub Projects
- Estadísticas con Google Sheets
- CI/CD con GitHub Actions
- Code Quality con ESLint + Prettier
- Integración del stack completo
- ROI de herramientas: 275%

**Páginas:** ~28  
**Tiempo de lectura:** 45 minutos

---

## 🚀 Orden de Lectura Recomendado

### Para Evaluadores/Profesores

```
1. RESUMEN_ENTREGABLES.md (10 min)
   ↓
2. Actividad_3 - Métricas del proyecto (20 min)
   ↓
3. Actividad_5 - Plan de mejora (25 min)
   ↓
4. Actividad_1 - Proceso actual (15 min)
   ↓
5. Actividad_2 - PROBE (20 min)
   ↓
6. Actividad_4 - Herramientas (15 min)

Total: ~105 minutos (1h 45min)
```

### Para Estudiantes de PSP

```
1. Actividad_1 - Entender cómo trabajar actualmente
   ↓
2. Actividad_3 - Ver cómo medir tu trabajo
   ↓
3. Actividad_2 - Aprender a estimar con PROBE
   ↓
4. Actividad_4 - Conocer herramientas útiles
   ↓
5. Actividad_5 - Planificar tu mejora
```

### Para Desarrolladores Interesados en Métricas

```
Enfoque rápido:
1. RESUMEN_ENTREGABLES.md
2. Actividad_3 (solo sección de métricas)
3. Actividad_4 (solo stack de herramientas)

Total: ~30 minutos
```

---

## 📊 Métricas Clave del Proyecto (Quick Reference)

```
┌────────────────────────────────────────────────────────┐
│  INMOGESTION - PSP METRICS DASHBOARD                   │
├────────────────────────────────────────────────────────┤
│  Total LOC:              5,910 líneas                  │
│  Tiempo Total:           151 horas                     │
│  Productividad:          39.14 LOC/hora                │
│  Densidad Defectos:      11.34 /KLOC                   │
│  Error Estimación:       20.7%                         │
│  Módulos Completados:    10                            │
│  Nivel PSP:              PSP1 (Intermedio)             │
└────────────────────────────────────────────────────────┘

Distribución del Tiempo:
  Codificación:  65% ████████████████████
  Diseño:        15% ███████░
  Testing:       10% █████░
  Planeación:     8% ████░
  Postmortem:     3% ██░
```

---

## 🎯 Hallazgos Clave

### ✅ Fortalezas Identificadas

1. **Productividad consistente:** 39.14 LOC/hora (por encima del promedio)
2. **Arquitectura modular:** Separación clara de responsabilidades
3. **Documentación técnica:** README, API docs actualizados
4. **Control de versiones:** Commits descriptivos, uso de branches

### ❌ Áreas Críticas de Mejora

1. **Densidad de defectos muy alta:** 11.34 /KLOC (5.6x el estándar PSP)
2. **Sin tests automatizados:** 0% cobertura = riesgo de regresiones
3. **67% del tiempo corrigiendo bugs:** Ineficiencia masiva
4. **Testing insuficiente:** Solo 10% del tiempo (meta: 20%)

### 🎯 Metas para Próximos 3 Meses

- [ ] Reducir defectos a < 5 /KLOC (-56%)
- [ ] Alcanzar 80% cobertura de tests
- [ ] Mejorar precisión estimaciones a <15% error
- [ ] Aumentar tiempo de testing a 20%

---

## 🛠️ Herramientas Utilizadas

| Herramienta | Propósito | Status |
|-------------|-----------|--------|
| **Clockify** | Time tracking | ✅ Configurado |
| **GitHub Issues** | Defect tracking | ✅ Templates creados |
| **Google Sheets** | Estadísticas PSP | ✅ Fórmulas implementadas |
| **GitHub Actions** | CI/CD | ⏳ Por implementar |
| **ESLint + Prettier** | Code quality | ✅ Configurado |
| **Git + GitHub** | Version control | ✅ En uso |

---

## 📚 Recursos Adicionales

### Documentación del Proyecto

- [README Principal](../../README.md) - Overview del proyecto
- [API Contract](../API_CONTRACT.md) - Documentación de endpoints
- [Git Workflow](../../Git_workflow.md) - Flujo de trabajo con Git
- [Instalación](../../INSTALL.md) - Guía de instalación

### Referencias PSP

- **Libro:** Humphrey, W. (1995). "A Discipline for Software Engineering"
- **Niveles PSP:** PSP0 (básico) → PSP1 (planeación) → PSP2 (calidad) → PSP3 (cíclico)
- **Benchmark:** Desarrolladores PSP maduros logran <2 defectos/KLOC

### Links Externos

- [PSP Official Site](http://www.sei.cmu.edu/watts/) - Carnegie Mellon University
- [Clockify](https://clockify.me) - Time tracking tool
- [GitHub Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects) - Project management

---

## 📞 Contacto y Soporte

**Equipo de Desarrollo:**
- Juan Sebastian Tique Rodriguez
- Yosman Fernando Espinosa  
- Yair Esteban Peña

**Email:** tiquesebastian53@gmail.com  
**GitHub:** [@tiquesebastian](https://github.com/tiquesebastian)  
**Repositorio:** [InmoGestion](https://github.com/tiquesebastian/InmoGestion)

---

## 📝 Notas de Actualización

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 12 Nov 2025 | Creación inicial de documentación PSP completa |

**Próxima actualización:** 15 Diciembre 2025 (revisión mensual)

---

## ⭐ Agradecimientos

Este trabajo PSP no habría sido posible sin:

- **Watts Humphrey** - Creador del Personal Software Process
- **Carnegie Mellon University** - Por desarrollar y documentar PSP
- **Comunidad Open Source** - Por las herramientas gratuitas utilizadas
- **Instructores** - Por la guía en la aplicación de PSP

---

**Elaborado con 📊 datos reales y 💡 compromiso de mejora continua**

---

> **"La calidad es gratis. No es un regalo, pero es gratis. Lo que cuesta dinero son las cosas sin calidad."**  
> — Philip Crosby

> **"No puedes gestionar lo que no puedes medir."**  
> — Peter Drucker

> **"El primer paso hacia el cambio es la conciencia. El segundo paso es la aceptación."**  
> — Nathaniel Branden
