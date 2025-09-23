# Flujo de trabajo con Git para InmoGestión

## 1. Convención de commits

- Se usa la convención **imperativa** y clara en mensajes, por ejemplo:
  - `feat: agregar funcionalidad de login`
  - `fix: corregir error en validación de formulario`
  - `docs: actualizar README`
  - `refactor: limpiar código del componente Dashboard`

## 2. Flujo de ramas

- `main`: rama estable, lista para producción.
- `develop`: rama de integración, aquí se unen las funcionalidades terminadas.
- `feature/*`: ramas de desarrollo de nuevas funcionalidades, derivadas de `develop`.

## 3. Política de pull requests

- Las ramas `feature/*` deben abrir un **pull request (PR)** hacia `develop`.
- Antes de hacer merge, se deben:
  - Revisar que pasen las pruebas unitarias.
  - Validar que el código pase el linter (eslint).
  - Realizar revisión de código entre pares (code review).
- Los PR deben tener descripción clara de los cambios y pruebas realizadas.

## 4. Frecuencia de push/pull

- Se recomienda hacer commits pequeños y frecuentes.
- Se debe hacer `git push` a la rama feature para subir avances.
- Antes de comenzar a trabajar, hacer `git pull` para actualizar la rama local.
- Integrar cambios de `develop` en `feature` regularmente para evitar conflictos grandes.

---

## Plantilla de Pull Request (opcional)

Título: [feat|fix|docs|refactor]: Breve descripción

Descripción:

- Qué cambios incluye
- Cómo probarlo
- Referencias a issues relacionados (si aplica)

---

**Fin del documento**
