-- INMOGESTIÓN - Script de instalación (solo tablas necesarias para el backend)
-- MySQL 8.0+ / InnoDB / utf8mb4

-- 0) Base de datos
CREATE DATABASE IF NOT EXISTS inmogestion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inmogestion;

-- 1) Roles
CREATE TABLE IF NOT EXISTS rol (
  id_rol INT PRIMARY KEY AUTO_INCREMENT,
  nombre_rol ENUM('Administrador','Agente') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO rol (id_rol, nombre_rol)
VALUES (1,'Administrador'),(2,'Agente')
ON DUPLICATE KEY UPDATE nombre_rol=VALUES(nombre_rol);

-- 2) Usuarios (admin/agentes)
CREATE TABLE IF NOT EXISTS usuario (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  estado ENUM('Activo','Inactivo') DEFAULT 'Activo',
  id_rol INT NOT NULL,
  -- Recuperación de contraseña
  reset_token VARCHAR(255) NULL,
  reset_token_expires DATETIME NULL,
  FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3) Localización
CREATE TABLE IF NOT EXISTS localidad (
  id_localidad INT PRIMARY KEY AUTO_INCREMENT,
  nombre_localidad VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS barrio (
  id_barrio INT PRIMARY KEY AUTO_INCREMENT,
  nombre_barrio VARCHAR(100) NOT NULL,
  codigo_postal VARCHAR(10) NOT NULL,
  id_localidad INT NOT NULL,
  FOREIGN KEY (id_localidad) REFERENCES localidad(id_localidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4) Clientes (con credenciales opcionales)
CREATE TABLE IF NOT EXISTS cliente (
  id_cliente INT PRIMARY KEY AUTO_INCREMENT,
  nombre_cliente VARCHAR(50) NOT NULL,
  apellido_cliente VARCHAR(50) NOT NULL,
  documento_cliente VARCHAR(20) UNIQUE NOT NULL,
  correo_cliente VARCHAR(100) UNIQUE NOT NULL,
  telefono_cliente VARCHAR(20),
  estado_cliente ENUM('Activo','Inactivo') DEFAULT 'Activo',
  nombre_usuario VARCHAR(50) NULL,
  contrasena VARCHAR(255) NULL,
  reset_token VARCHAR(255) NULL,
  reset_token_expires DATETIME NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_cliente_nombre_usuario (nombre_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5) Documentos de clientes
CREATE TABLE IF NOT EXISTS documento_cliente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  tipo_documento VARCHAR(50) NOT NULL,
  nombre_archivo VARCHAR(255) NOT NULL,
  ruta_archivo VARCHAR(500) NOT NULL,
  descripcion TEXT,
  subido_por INT NOT NULL,
  fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES cliente(id_cliente) ON DELETE CASCADE,
  FOREIGN KEY (subido_por) REFERENCES usuario(id_usuario) ON DELETE RESTRICT,
  INDEX idx_cliente (cliente_id),
  INDEX idx_tipo (tipo_documento),
  INDEX idx_fecha (fecha_subida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6) Propiedades
CREATE TABLE IF NOT EXISTS propiedad (
  id_propiedad INT PRIMARY KEY AUTO_INCREMENT,
  tipo_propiedad ENUM('Casa','Apartamento','Lote') NOT NULL,
  direccion_formato VARCHAR(200) NOT NULL,
  precio_propiedad DECIMAL(15,2) NOT NULL,
  area_m2 DECIMAL(10,2) NOT NULL,
  num_habitaciones INT NULL,
  num_banos INT NULL,
  descripcion TEXT,
  estado_propiedad ENUM('Disponible','Reservada','Vendida') DEFAULT 'Disponible',
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_venta DATE NULL,
  id_barrio INT NOT NULL,
  id_usuario INT NOT NULL,
  FOREIGN KEY (id_barrio) REFERENCES barrio(id_barrio),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7) Contratos (metadatos generales)
CREATE TABLE IF NOT EXISTS contrato (
  id_contrato INT PRIMARY KEY AUTO_INCREMENT,
  fecha_contrato DATE NOT NULL,
  valor_venta DECIMAL(15,2) NOT NULL,
  fecha_venta DATE NOT NULL,
  archivo_pdf VARCHAR(255),
  id_propiedad INT NOT NULL,
  id_cliente INT NOT NULL,
  id_usuario INT NOT NULL,
  estado_contrato ENUM('Activo','Anulado','Finalizado') DEFAULT 'Activo',
  FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad),
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7.1) Contratos generados (documento PDF completo)
CREATE TABLE IF NOT EXISTS contrato_documento (
  id_contrato_documento INT AUTO_INCREMENT PRIMARY KEY,
  id_contrato INT NULL,
  id_propiedad INT NOT NULL,
  id_cliente INT NOT NULL,
  tipo_inmueble ENUM('Casa','Apartamento','Lote') NOT NULL,
  vendedor_nombre VARCHAR(200) NOT NULL,
  vendedor_apellido VARCHAR(200) NOT NULL,
  vendedor_tipo_documento ENUM('CC','CE','NIT','Pasaporte') NOT NULL,
  vendedor_numero_documento VARCHAR(50) NOT NULL,
  vendedor_direccion VARCHAR(300),
  vendedor_telefono VARCHAR(20),
  comprador_nombre VARCHAR(200) NOT NULL,
  comprador_apellido VARCHAR(200) NOT NULL,
  comprador_tipo_documento ENUM('CC','CE','NIT','Pasaporte') NOT NULL,
  comprador_numero_documento VARCHAR(50) NOT NULL,
  comprador_direccion VARCHAR(300),
  comprador_telefono VARCHAR(20),
  inmueble_matricula VARCHAR(100),
  inmueble_area_m2 DECIMAL(10,2),
  inmueble_direccion TEXT NOT NULL,
  inmueble_linderos TEXT,
  inmueble_descripcion TEXT,
  precio_venta DECIMAL(15,2) NOT NULL,
  forma_pago TEXT NOT NULL,
  clausulas_adicionales TEXT,
  lugar_firma VARCHAR(200) NOT NULL DEFAULT 'Bogotá D.C.',
  fecha_firma DATE NOT NULL,
  archivo_pdf VARCHAR(500),
  estado_documento ENUM('Generado','Firmado','Anulado') DEFAULT 'Generado',
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

-- 8) Interés de clientes
CREATE TABLE IF NOT EXISTS interes_propiedad (
  id_interes INT PRIMARY KEY AUTO_INCREMENT,
  id_propiedad INT NOT NULL,
  id_cliente INT NULL,
  nombre_cliente VARCHAR(150) NULL,
  correo_cliente VARCHAR(150) NULL,
  telefono_cliente VARCHAR(50) NULL,
  mensaje TEXT NULL,
  preferencias JSON NULL,
  estado ENUM('Pendiente','Contactado','Agendado','Cancelado') DEFAULT 'Pendiente',
  id_agente_asignado INT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad),
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
  FOREIGN KEY (id_agente_asignado) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9) Visitas
CREATE TABLE IF NOT EXISTS visita (
  id_visita INT PRIMARY KEY AUTO_INCREMENT,
  id_propiedad INT NOT NULL,
  id_cliente INT NOT NULL,
  id_agente INT NOT NULL,
  fecha_visita DATETIME NOT NULL,
  hora_visita TIME NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'Programada',
  notas TEXT,
  recordatorio_enviado TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad),
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
  FOREIGN KEY (id_agente) REFERENCES usuario(id_usuario),
  INDEX idx_visita_cliente_fecha (id_cliente, fecha_visita)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10) Imágenes de propiedades
CREATE TABLE IF NOT EXISTS imagen_propiedad (
  id_imagen INT PRIMARY KEY AUTO_INCREMENT,
  id_propiedad INT NOT NULL,
  url VARCHAR(512) NOT NULL,
  prioridad INT DEFAULT 0,
  descripcion VARCHAR(255),
  fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11) Notificaciones (log)
CREATE TABLE IF NOT EXISTS notificacion (
  id_notificacion INT PRIMARY KEY AUTO_INCREMENT,
  tipo ENUM('EMAIL','WHATSAPP','SMS','PUSH'),
  canal VARCHAR(50),
  destinatario VARCHAR(255),
  asunto VARCHAR(255),
  contenido TEXT,
  estado ENUM('Enviado','Error','Pendiente') DEFAULT 'Pendiente',
  referencia_tipo VARCHAR(50),
  referencia_id INT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12) Búsquedas (estadísticas)
CREATE TABLE IF NOT EXISTS busqueda (
  id_busqueda INT PRIMARY KEY AUTO_INCREMENT,
  query_text VARCHAR(500),
  filtros JSON,
  id_usuario INT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13) Auditoría
CREATE TABLE IF NOT EXISTS auditoria (
  id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
  tabla_afectada VARCHAR(50) NOT NULL,
  accion VARCHAR(20) NOT NULL,
  descripcion TEXT,
  usuario_accion VARCHAR(100),
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tabla VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FIN: Tablas listas para que el backend funcione.
