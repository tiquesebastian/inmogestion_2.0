-- Tabla para almacenar contratos generados
CREATE TABLE IF NOT EXISTS contrato_documento (
  id_contrato_documento INT AUTO_INCREMENT PRIMARY KEY,
  id_contrato INT NULL,
  id_propiedad INT NOT NULL,
  id_cliente INT NOT NULL,
  tipo_inmueble ENUM('Casa', 'Apartamento', 'Lote') NOT NULL,
  
  -- Datos del vendedor (JSON)
  vendedor_nombre VARCHAR(200) NOT NULL,
  vendedor_apellido VARCHAR(200) NOT NULL,
  vendedor_tipo_documento ENUM('CC', 'CE', 'NIT', 'Pasaporte') NOT NULL,
  vendedor_numero_documento VARCHAR(50) NOT NULL,
  vendedor_direccion VARCHAR(300),
  vendedor_telefono VARCHAR(20),
  
  -- Datos del comprador (JSON)
  comprador_nombre VARCHAR(200) NOT NULL,
  comprador_apellido VARCHAR(200) NOT NULL,
  comprador_tipo_documento ENUM('CC', 'CE', 'NIT', 'Pasaporte') NOT NULL,
  comprador_numero_documento VARCHAR(50) NOT NULL,
  comprador_direccion VARCHAR(300),
  comprador_telefono VARCHAR(20),
  
  -- Datos del inmueble
  inmueble_matricula VARCHAR(100),
  inmueble_area_m2 DECIMAL(10,2),
  inmueble_direccion TEXT NOT NULL,
  inmueble_linderos TEXT,
  inmueble_descripcion TEXT,
  
  -- Datos económicos
  precio_venta DECIMAL(15,2) NOT NULL,
  forma_pago TEXT NOT NULL,
  
  -- Cláusulas adicionales
  clausulas_adicionales TEXT,
  
  -- Lugar y fecha de firma
  lugar_firma VARCHAR(200) NOT NULL DEFAULT 'Bogotá D.C.',
  fecha_firma DATE NOT NULL,
  
  -- Archivo generado
  archivo_pdf VARCHAR(500),
  estado_documento ENUM('Generado', 'Firmado', 'Anulado') DEFAULT 'Generado',
  
  -- Auditoría
  fecha_generacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  generado_por INT NOT NULL,
  
  FOREIGN KEY (id_contrato) REFERENCES contrato(id_contrato) ON DELETE SET NULL,
  FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad) ON DELETE CASCADE,
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE,
  FOREIGN KEY (generado_por) REFERENCES usuario(id_usuario) ON DELETE RESTRICT,
  
  INDEX idx_cliente (id_cliente),
  INDEX idx_propiedad (id_propiedad),
  INDEX idx_fecha (fecha_generacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
