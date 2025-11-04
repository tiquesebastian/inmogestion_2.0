# 📘 Guía de Estándares de Codificación - InmoGestión

Este documento define las reglas de codificación que todo el equipo debe seguir para garantizar **consistencia, legibilidad y mantenibilidad** del código en el proyecto **InmoGestión**.

---

## 1. Reglas de Nombres

### Variables
- Usar **camelCase** para variables y constantes locales.
- Constantes globales en **MAYÚSCULAS_CON_GUIONES**.
- Nombres deben ser **descriptivos** y en **español** (mantener consistencia).

✅ Aceptado:
```js
let precioPropiedad = 250000;
const API_URL = "http://localhost:3000/api";

❌ No aceptado:

let x = 250000;
const ApiUrl = "http://localhost:3000/api";

Clases y Modelos

Usar PascalCase.

Nombres en singular y representando la entidad.

✅ Aceptado:

class ClienteModel {}
class Propiedad {}


❌ No aceptado:

class cliente {}
class propiedadesModel {}

Métodos y Funciones

Usar camelCase.

El nombre debe indicar la acción que realiza.

✅ Aceptado:

function obtenerClientes() {}
function crearContrato() {}


❌ No aceptado:

function data() {}
function C_Contrato() {}

2. Comentarios y Documentación Interna

Usar comentarios en línea para aclarar lógica compleja.

Documentar funciones y controladores con JSDoc.

✅ Aceptado:

/**
 * Crea un nuevo cliente en la base de datos
 * @param {Request} req - Objeto de petición
 * @param {Response} res - Objeto de respuesta
 */
export const createCliente = async (req, res) => {
  // Validar datos de entrada
  if (!req.body.nombre_cliente) {
    return res.status(400).json({ message: "Nombre requerido" });
  }
};


❌ No aceptado:

// función
export const createCliente = (req, res) => {
  // hace cosas
};

3. Identación y Estilo de Código

Usar 2 espacios para identación.

Una línea en blanco entre bloques lógicos.

Máximo 80-100 caracteres por línea.

Archivos terminan siempre con una línea en blanco.

Evitar código comentado innecesario.

✅ Aceptado:

if (usuarioActivo) {
  procesarUsuario(usuarioActivo);
} else {
  return res.status(404).json({ message: "Usuario no encontrado" });
}


❌ No aceptado:

if(usuarioActivo){procesarUsuario(usuarioActivo);}else{return res.status(404).json({message:"Usuario no encontrado"});}

4. Ejemplos en React + Tailwind

✅ Aceptado:

export default function Header() {
  return (
    <header className="bg-blue-900 p-4 text-white">
      <h1 className="text-2xl font-bold">InmoGestión</h1>
    </header>
  );
}


❌ No aceptado:

export default function header(){
return <header class="bg-blue-900 p-4 text-white"><h1>InmoGestión</h1></header>
}

5. Organización del Repositorio

/backend/ → Código de servidor (Express, controladores, modelos).

/frontend/ → Interfaz en React + Tailwind.

/database/ → Scripts SQL, procedimientos y vistas.

/docs/ → Documentación del proyecto.

README.md → Guía general del proyecto.

Guia_EstandaresCodigo.md → Este documento.

6. Buenas Prácticas

Usar Git Flow: ramas main, develop y ramas de feature.

Commits descriptivos en español:

feat: agregar endpoint de contratos

fix: corregir validación en cliente

docs: actualizar guía de estándares

📌 Nota: Cualquier nueva funcionalidad debe seguir estas reglas antes de ser aceptada en el repositorio.


---

👉 ¿Quieres que lo deje así **general para todo el stack**, o lo dividimos en dos secciones claras: **Frontend (React)** y **Backend (Node.js/Express)** para que quede más estructurado en el documento?
