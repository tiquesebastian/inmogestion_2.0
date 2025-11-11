# 🚀 Inicio Rápido - InmoGestión

## 📋 Pasos para Iniciar el Proyecto

### 1️⃣ Iniciar el Backend

```bash
# Abrir terminal en la carpeta del backend
cd .vscode

# Iniciar el servidor (debe estar en puerto 4000)
npm start
```

**Verificar que el backend esté corriendo:**
- Deberías ver: `✅ Servidor corriendo en http://localhost:4000`
- Verificar conexión: http://localhost:4000/api/propiedades

### 2️⃣ Iniciar el Frontend

```bash
# Abrir OTRA terminal en la carpeta del frontend
cd inmogestion-frontend

# Iniciar el servidor de desarrollo
npm run dev
```

**Verificar que el frontend esté corriendo:**
- Deberías ver: `Local: http://localhost:5173/`
- Abrir en navegador: http://localhost:5173

### 3️⃣ Acceder a la Aplicación

**Página Principal:**
- URL: http://localhost:5173/
- Verás el slider hero y las propiedades destacadas

**Panel de Administración:**
- URL: http://localhost:5173/inmogestion
- Login con tus credenciales de admin

**Ver Propiedades:**
- URL: http://localhost:5173/propiedades
- Búsqueda y filtros disponibles

---

## 🎨 Mejoras Implementadas en la Página de Inicio

### ✨ Nueva Vista Principal

1. **Hero Slider Profesional**
   - Slider automático con imágenes destacadas
   - Diseño moderno y atractivo

2. **Búsqueda Avanzada**
   - Posicionada sobre el slider (estilo Fincaraíz)
   - Filtros por: localidad, tipo, habitaciones, baños, precio
   - Responsive en todos los dispositivos
   - Diseño con sombras y gradientes

3. **Propiedades Destacadas**
   - Grid responsive (1 columna móvil, 4 columnas desktop)
   - Tarjetas con:
     - Imagen de la propiedad
     - Precio destacado
     - Ubicación
     - Características (habitaciones, baños, área)
     - Badge de tipo y estado
     - Efecto hover elegante
   - Carga desde el backend en tiempo real
   - Máximo 8 propiedades destacadas

4. **Sección de Beneficios**
   - 3 características principales
   - Diseño con gradiente azul
   - Iconos atractivos

5. **Call to Action**
   - Invitación para agentes inmobiliarios
   - Botón destacado de registro

### 📱 Diseño Responsive

- **Móvil (< 640px)**: 1 columna, navegación optimizada
- **Tablet (640-1024px)**: 2 columnas de propiedades
- **Desktop (> 1024px)**: 4 columnas de propiedades

### 🎯 Características Especiales

- **Carga Dinámica**: Las propiedades se cargan desde la API
- **Imagen Fallback**: Si no hay imagen, muestra un placeholder elegante
- **Animaciones**: Hover effects en tarjetas
- **Performance**: Loading state mientras cargan las propiedades
- **SEO Friendly**: Estructura semántica HTML5

---

## 🛠️ Solución de Problemas

### No se ven las propiedades

**Problema**: La sección de propiedades está vacía

**Solución:**
1. Verifica que el backend esté corriendo en puerto 4000
2. Verifica que haya propiedades en la base de datos
3. Abre la consola del navegador (F12) y verifica errores
4. Prueba la API directamente: http://localhost:4000/api/propiedades

### Error de CORS

**Problema**: Error "CORS policy" en la consola

**Solución:**
1. Verifica que el backend tenga configurado CORS
2. En `.vscode/src/server.js` debe tener:
```javascript
app.use(cors());
```

### Las imágenes no cargan

**Problema**: Las imágenes aparecen rotas

**Solución:**
1. Verifica que la carpeta `uploads/` exista en el backend
2. Verifica que las propiedades tengan `imagen_principal` en la BD
3. Las imágenes deben estar en: `.vscode/uploads/propiedades/`

---

## 📊 Datos de Prueba

Si no tienes propiedades en la base de datos, puedes agregarlas desde el panel de administración:

1. Accede a: http://localhost:5173/inmogestion
2. Inicia sesión como admin
3. Ve a "Registrar Propiedad"
4. Llena el formulario con datos de prueba

---

## 🎨 Personalización

### Cambiar Colores

Edita `inmogestion-frontend/src/pages/inicio.jsx`:

- **Color principal**: `from-blue-600 to-blue-700` → Cambiar a tus colores
- **Color secundario**: `from-blue-600 to-indigo-700` → Ajustar gradientes
- **Color de botones**: `bg-blue-600` → Tu color preferido

### Cambiar Cantidad de Propiedades

En `inicio.jsx`, línea del fetch:
```javascript
const response = await fetch('http://localhost:4000/api/propiedades?limit=8');
setPropiedadesDestacadas(data.slice(0, 8)); // Cambiar el 8 por el número deseado
```

### Cambiar Textos

Todos los textos están en español y son fáciles de encontrar en el archivo `inicio.jsx`.

---

## ✅ Checklist de Verificación

Antes de presentar el proyecto, verifica:

- [ ] Backend corriendo en puerto 4000
- [ ] Frontend corriendo en puerto 5173
- [ ] MySQL corriendo y base de datos creada
- [ ] Al menos 3-5 propiedades de prueba en la BD
- [ ] Imágenes cargadas para las propiedades
- [ ] Formulario de búsqueda funcional
- [ ] Navegación entre páginas funciona
- [ ] Responsive en móvil, tablet y desktop

---

## 🌟 Resultado Final

Tu página de inicio ahora se ve **profesional y moderna**, similar a portales inmobiliarios líderes como Fincaraíz, con:

- Diseño limpio y atractivo
- Propiedades destacadas visibles
- Búsqueda intuitiva
- Responsive en todos los dispositivos
- Carga dinámica desde el backend
- Experiencia de usuario mejorada

**¡Disfruta tu proyecto InmoGestión mejorado! 🏡✨**
