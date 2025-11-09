-- Tabla para documentos de clientes (cédulas, comprobantes, etc.)
CREATE TABLE IF NOT EXISTS documento_cliente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  tipo_documento VARCHAR(50) NOT NULL COMMENT 'cedula, comprobante_ingresos, comprobante_domicilio, escrituras, etc.',
  nombre_archivo VARCHAR(255) NOT NULL,
  ruta_archivo VARCHAR(500) NOT NULL,
  descripcion TEXT,
  subido_por INT NOT NULL COMMENT 'Usuario que subió el documento',
  fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (cliente_id) REFERENCES cliente(id_cliente) ON DELETE CASCADE,
  FOREIGN KEY (subido_por) REFERENCES usuario(id_usuario) ON DELETE RESTRICT,
  
  INDEX idx_cliente (cliente_id),
  INDEX idx_tipo (tipo_documento),
  INDEX idx_fecha (fecha_subida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
