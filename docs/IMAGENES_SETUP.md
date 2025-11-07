# Configuración del Sistema de Imágenes para Propiedades

## 📋 Resumen
Se ha implementado un sistema completo para manejar imágenes de propiedades, incluyendo:
- Frontend con preview y upload
- Backend con endpoints para GET/POST/DELETE
- Almacenamiento de imágenes en carpeta `uploads/`

## 🗄️ Estructura de Base de Datos

Ya tienes la tabla `imagen_propiedad` con esta estructura:

```sql
CREATE TABLE imagen_propiedad (
  id_imagen INT PRIMARY KEY AUTO_INCREMENT,
  id_propiedad INT NOT NULL,
  url VARCHAR(512) NOT NULL,
  prioridad INT DEFAULT 0,
  descripcion VARCHAR(255),
  fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad)
);
```

## 🔧 Pasos de Integración en el Backend

### 1. Instalar dependencia de multer (si no está instalada)

```bash
cd .vscode
npm install multer
```

### 2. Crear carpeta para almacenar imágenes

```bash
# En la raíz del backend (.vscode/)
mkdir uploads
```

### 3. Agregar la ruta en el archivo principal (app.js o index.js)

Busca el archivo principal de tu servidor (probablemente `.vscode/src/app.js` o `.vscode/src/index.js`) y agrega:

```javascript
// Importar las rutas de imágenes
const imagenRoutes = require('./routes/imagen.routes');

// Configurar para servir archivos estáticos (imágenes)
app.use('/uploads', express.static('uploads'));

// Registrar las rutas
app.use('/api/imagenes', imagenRoutes);
```

### 4. Verificar la configuración de CORS

Asegúrate de que tu configuración de CORS permita uploads de archivos:

```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Tu frontend
  credentials: true
}));
```

## 📡 Endpoints Disponibles

### GET `/api/imagenes/propiedad/:id_propiedad`
Obtiene todas las imágenes de una propiedad específica.

**Respuesta:**
```json
[
  {
    "id_imagen": 1,
    "id_propiedad": 123,
    "url": "/uploads/propiedad-1699380000-123456789.jpg",
    "prioridad": 0,
    "descripcion": "Imagen 1",
    "fecha_subida": "2025-11-07T10:00:00.000Z"
  }
]
```

### POST `/api/imagenes/propiedad`
Sube una nueva imagen para una propiedad.

**Body (multipart/form-data):**
- `imagen`: archivo de imagen
- `id_propiedad`: ID de la propiedad
- `prioridad`: prioridad de la imagen (0 = principal)
- `descripcion`: descripción opcional

**Respuesta:**
```json
{
  "id_imagen": 1,
  "id_propiedad": 123,
  "url": "/uploads/propiedad-1699380000-123456789.jpg",
  "prioridad": 0,
  "descripcion": "Imagen 1"
}
```

### DELETE `/api/imagenes/:id_imagen`
Elimina una imagen (tanto el archivo como el registro en BD).

### PATCH `/api/imagenes/:id_imagen/prioridad`
Actualiza la prioridad de una imagen.

## 🎨 Frontend Implementado

### Componentes Actualizados:

1. **FilteredProperties.jsx** - Muestra imágenes en las tarjetas
2. **RegistrarPropiedad.jsx** (Admin y Agente) - Permite subir imágenes

### API Functions (src/services/api.js):

```javascript
// Obtener imágenes de una propiedad
getImagenesByPropiedad(idPropiedad)

// Subir imagen
uploadImagenPropiedad(idPropiedad, file, prioridad, descripcion)
```

## 🚀 Uso en el Frontend

### Al Registrar una Propiedad:

1. Usuario selecciona imágenes
2. Se muestra preview
3. Al enviar el formulario:
   - Primero se crea la propiedad
   - Luego se suben las imágenes asociadas
4. La primera imagen tiene prioridad 0 (principal)

### Al Listar Propiedades:

1. Se cargan las propiedades
2. Para cada propiedad, se obtienen sus imágenes
3. Se muestra la imagen con mayor prioridad
4. Si no hay imagen, se muestra un placeholder

## ✅ Checklist de Verificación

- [ ] Instalar multer: `npm install multer`
- [ ] Crear carpeta `uploads/` en el backend
- [ ] Agregar `app.use('/uploads', express.static('uploads'));` en app.js
- [ ] Agregar `app.use('/api/imagenes', imagenRoutes);` en app.js
- [ ] Verificar que el servidor backend esté corriendo
- [ ] Probar subir una imagen desde el frontend
- [ ] Verificar que la imagen se guarde en `uploads/`
- [ ] Verificar que aparezca en FilteredProperties

## 🔍 Troubleshooting

### Error: "Cannot find module 'multer'"
Solución: `npm install multer`

### Error: "ENOENT: no such file or directory, open 'uploads/...'"
Solución: Crear la carpeta `mkdir uploads` en la raíz del backend

### Las imágenes no se muestran en el frontend
Solución: Verificar que `app.use('/uploads', express.static('uploads'));` esté configurado

### Error de CORS al subir imágenes
Solución: Asegurar que CORS permita multipart/form-data

## 📝 Notas Adicionales

- Las imágenes se almacenan localmente en la carpeta `uploads/`
- El nombre del archivo se genera automáticamente: `propiedad-{timestamp}-{random}.{ext}`
- La prioridad determina cuál imagen se muestra primero (mayor prioridad = primera)
- El frontend maneja automáticamente los errores de carga de imágenes mostrando placeholder
- Límite de tamaño: 5MB por imagen
- Formatos permitidos: JPEG, JPG, PNG, GIF, WEBP
 - Límite de cantidad: 10 imágenes por propiedad (el backend devuelve 409 si se supera)
 - El frontend corta el exceso y muestra mensaje: “Máximo permitido: 10 imágenes. Se ignoraron las adicionales.”
