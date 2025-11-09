# Módulo de Generación de Contratos - InmoGestión

## Descripción General

Sistema completo de generación automática de contratos de compraventa de inmuebles (Casa, Apartamento, Lote) con:
- Generación automática de PDF desde plantillas HTML
- Formularios completos para captura de datos
- Almacenamiento seguro en base de datos
- Descarga de contratos para clientes
- Acceso desde panel de Admin y Agente

---

## 🗂️ Estructura de Archivos

### Backend (`.vscode/`)

```
.vscode/
├── db/
│   └── contratos.sql                    # Script SQL para crear tabla
├── src/
│   ├── models/
│   │   └── contratoDocumento.model.js   # Modelo de datos
│   ├── controllers/
│   │   └── contratoDocumento.controller.js  # Lógica de negocio
│   ├── routes/
│   │   └── contratoDocumento.routes.js  # Endpoints REST
│   ├── utils/
│   │   └── plantillasContrato.js        # Plantillas HTML
│   └── server.js                         # Registro de rutas
```

### Frontend (`inmogestion-frontend/`)

```
inmogestion-frontend/
├── src/
│   ├── services/
│   │   └── api.js                       # Funciones API (generarContrato, etc.)
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── GenerarContrato.jsx      # Formulario admin
│   │   │   └── AdminDashboard.jsx       # Ruta añadida
│   │   ├── agente/
│   │   │   ├── GenerarContrato.jsx      # Formulario agente
│   │   │   └── AgenteDashboard.jsx      # Ruta añadida
│   │   └── cliente/
│   │       ├── MisContratos.jsx         # Vista de contratos (opcional)
│   │       └── ClienteDashboard.jsx     # Sección de contratos integrada
```

---

## 📋 Base de Datos

### Tabla: `contrato_documento`

Ejecutar el script SQL:

```bash
mysql -u tu_usuario -p tu_base_de_datos < .vscode/db/contratos.sql
```

**Campos principales:**
- Identificación del contrato
- Datos del vendedor (nombre, apellido, tipo y número de documento, dirección, teléfono)
- Datos del comprador (mismo esquema que vendedor)
- Datos del inmueble (matrícula, área, dirección, linderos, descripción)
- Precio y forma de pago
- Cláusulas adicionales
- Archivo PDF generado
- Auditoría (fecha, usuario generador)

---

## ⚙️ Instalación Backend

### 1. Instalar Dependencias

**IMPORTANTE:** Necesitas instalar Puppeteer para la generación de PDFs.

Desde la terminal de PowerShell **como Administrador**:

```powershell
# Permitir ejecución de scripts
Set-ExecutionPolicy RemoteSigned

# Navegar a la carpeta del backend
cd C:\Users\Janus\inmogestion\.vscode

# Instalar puppeteer
npm install puppeteer
```

### 2. Crear Carpeta de Uploads

Asegúrate de que existe la carpeta para almacenar PDFs generados:

```powershell
New-Item -Path "C:\Users\Janus\inmogestion\.vscode\uploads\contratos" -ItemType Directory -Force
```

### 3. Verificar Configuración

El servidor ya tiene las rutas registradas en `server.js`:

```javascript
import contratoDocumentoRoutes from "./routes/contratoDocumento.routes.js";
app.use("/api/contratos-documentos", contratoDocumentoRoutes);
```

---

## 🔗 Endpoints API

Base URL: `http://localhost:4000/api/contratos-documentos`

### POST `/generar`
Generar nuevo contrato de compraventa

**Body (JSON):**
```json
{
  "id_propiedad": 1,
  "id_cliente": 5,
  "tipo_inmueble": "Casa",
  "vendedor_nombre": "Juan",
  "vendedor_apellido": "Pérez",
  "vendedor_tipo_documento": "CC",
  "vendedor_numero_documento": "123456789",
  "vendedor_direccion": "Calle 123",
  "vendedor_telefono": "3001234567",
  "comprador_nombre": "María",
  "comprador_apellido": "González",
  "comprador_tipo_documento": "CC",
  "comprador_numero_documento": "987654321",
  "comprador_direccion": "Carrera 45",
  "comprador_telefono": "3109876543",
  "inmueble_matricula": "001-2024",
  "inmueble_area_m2": 150.5,
  "inmueble_direccion": "Calle 50 #23-10",
  "inmueble_linderos": "Norte: Calle 50, Sur: Propiedad privada...",
  "inmueble_descripcion": "Casa de dos pisos...",
  "precio_venta": 350000000,
  "forma_pago": "Pago de contado al momento de la firma...",
  "clausulas_adicionales": "Las partes acuerdan...",
  "lugar_firma": "Bogotá D.C.",
  "fecha_firma": "2025-01-15",
  "generado_por": 2
}
```

**Response:**
```json
{
  "message": "Contrato generado exitosamente",
  "id_contrato_documento": 1,
  "archivo_pdf": "/uploads/contratos/contrato_1_1234567890.pdf"
}
```

### GET `/cliente/:id_cliente`
Obtener contratos de un cliente

**Response:**
```json
[
  {
    "id_contrato_documento": 1,
    "tipo_inmueble": "Casa",
    "precio_venta": 350000000,
    "fecha_firma": "2025-01-15",
    "archivo_pdf": "/uploads/contratos/contrato_1_1234567890.pdf",
    "estado_documento": "Generado",
    ...
  }
]
```

### GET `/:id`
Obtener contrato por ID

### GET `/descargar/:id`
Descargar PDF del contrato

### GET `/`
Listar todos los contratos (admin/agente)

---

## 🖥️ Uso en Frontend

### Admin / Agente

1. Navegar a: **Generar Contrato** (en el menú lateral)
2. Completar el formulario en 6 pasos:
   - Seleccionar propiedad y cliente
   - Datos del vendedor
   - Datos del comprador
   - Datos del inmueble
   - Datos económicos (precio, forma de pago)
   - Información adicional (lugar, fecha, cláusulas)
3. Click en **Generar Contrato**
4. El sistema crea el PDF y lo almacena en el servidor

### Cliente

1. El cliente ve automáticamente sus contratos en el **Dashboard**
2. Sección "📄 Mis Contratos" muestra:
   - Lista de contratos generados
   - Detalles (tipo, precio, fecha)
   - Botón de descarga para cada contrato

---

## 📄 Plantillas de Contrato

Ubicadas en: `.vscode/src/utils/plantillasContrato.js`

### Tipos de Plantilla:
1. **Casa** (`plantillaContratoCasa`)
2. **Apartamento** (`plantillaContratoApartamento`)
3. **Lote** (`plantillaContratoLote`)

Cada plantilla:
- Formato HTML profesional con estilos CSS
- Secciones estándar: REUNIDOS, EXPONEN, CLÁUSULAS
- Marcadores dinámicos que se reemplazan con datos del formulario
- Espacios para firmas del vendedor y comprador

### Personalización

Para modificar las plantillas, editar `plantillasContrato.js`:

```javascript
export const plantillaContratoCasa = (datos) => {
  // Modificar HTML aquí
  return `
    <!DOCTYPE html>
    ...
  `;
};
```

---

## 🔒 Seguridad

1. **Validación de Datos:**
   - Campos obligatorios verificados en backend
   - Tipos de documento permitidos: CC, CE, NIT, Pasaporte
   - Tipos de inmueble permitidos: Casa, Apartamento, Lote

2. **Auditoría:**
   - Registro de fecha y hora de generación
   - Usuario que generó el contrato (campo `generado_por`)
   - Estado del documento (Generado, Firmado, Anulado)

3. **Archivos PDF:**
   - Almacenados en carpeta protegida `/uploads/contratos/`
   - Nombres únicos con timestamp
   - Acceso controlado vía endpoint `/descargar/:id`

---

## 🧪 Pruebas

### Probar Generación de Contrato

```bash
curl -X POST http://localhost:4000/api/contratos-documentos/generar \
  -H "Content-Type: application/json" \
  -d '{
    "id_propiedad": 1,
    "id_cliente": 5,
    "tipo_inmueble": "Casa",
    "vendedor_nombre": "Juan",
    "vendedor_apellido": "Pérez",
    "vendedor_tipo_documento": "CC",
    "vendedor_numero_documento": "123456789",
    "comprador_nombre": "María",
    "comprador_apellido": "González",
    "comprador_tipo_documento": "CC",
    "comprador_numero_documento": "987654321",
    "inmueble_direccion": "Calle 50 #23-10",
    "precio_venta": 350000000,
    "forma_pago": "Pago de contado",
    "fecha_firma": "2025-01-15",
    "lugar_firma": "Bogotá D.C.",
    "generado_por": 2
  }'
```

### Probar Descarga

```bash
curl -o contrato.pdf http://localhost:4000/api/contratos-documentos/descargar/1
```

---

## 🐛 Troubleshooting

### Error: "Puppeteer no encontrado"
```bash
cd .vscode
npm install puppeteer
```

### Error: "Cannot write file"
Verificar permisos en carpeta `uploads/contratos/`:
```bash
icacls uploads\contratos /grant Users:F
```

### PDF vacío o con errores
- Verificar que las plantillas HTML estén bien formadas
- Revisar logs del servidor para errores de Puppeteer
- Asegurarse de que los datos del formulario estén completos

### Formulario no carga propiedades/clientes
- Verificar que los endpoints `/api/propiedades` y `/api/clientes` estén funcionando
- Revisar consola del navegador para errores de red

---

## 📦 Dependencias

### Backend
- `puppeteer` - Generación de PDFs desde HTML
- `express` - Framework web
- `mysql2` - Conexión a base de datos

### Frontend
- `react-router-dom` - Navegación
- Servicios API personalizados

---

## 🚀 Próximas Mejoras

1. **Firma Electrónica:** Integrar módulo de firma digital
2. **Envío por Email:** Notificar al cliente cuando su contrato esté listo
3. **Plantillas Personalizables:** Editor WYSIWYG para modificar plantillas
4. **Versionado:** Mantener historial de cambios en contratos
5. **Exportar a Word:** Opción adicional de formato .docx

---

## 📞 Soporte

Para dudas o problemas con el módulo de contratos, revisar:
- Logs del backend: consola donde corre `npm run dev`
- Logs del frontend: consola del navegador (F12)
- Documentación API: `docs/API_CONTRACT.md`

---

**Última actualización:** 8 de noviembre de 2025  
**Versión:** 1.0
