-- PROYECTO INMOGESTIÓN - SCRIPT MAESTRO
-- Base de Datos + Datos Iniciales + Verificación
-- ==========================================================

-- 1. CREAR BASE DE DATOS
DROP DATABASE IF EXISTS inmogestion;
CREATE DATABASE inmogestion;
USE inmogestion;

-- ==========================================================
-- 2. TABLAS PRINCIPALES
-- ==========================================================

-- ROLES
CREATE TABLE rol (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol ENUM('Administrador', 'Agente') NOT NULL
);

-- USUARIOS
CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    id_rol INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);


INSERT INTO rol (id_rol, nombre_rol)
VALUES 
(1, 'Administrador'),
(2, 'Agente');

-- LOCALIDADES
CREATE TABLE localidad (
    id_localidad INT PRIMARY KEY AUTO_INCREMENT,
    nombre_localidad VARCHAR(100) NOT NULL
);

-- BARRIOS
CREATE TABLE barrio (
    id_barrio INT PRIMARY KEY AUTO_INCREMENT,
    nombre_barrio VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10) NOT NULL,
    id_localidad INT NOT NULL,
    FOREIGN KEY (id_localidad) REFERENCES localidad(id_localidad)
);

-- CLIENTES
CREATE TABLE cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre_cliente VARCHAR(50) NOT NULL,
    apellido_cliente VARCHAR(50) NOT NULL,
    documento_cliente VARCHAR(20) UNIQUE NOT NULL,
    correo_cliente VARCHAR(100) UNIQUE NOT NULL,
    telefono_cliente VARCHAR(20),
    estado_cliente ENUM('Activo', 'Inactivo') DEFAULT 'Activo'
);
ALTER TABLE cliente
  ADD COLUMN nombre_usuario VARCHAR(50) NULL,
  ADD COLUMN contrasena VARCHAR(255) NULL,
  ADD COLUMN reset_token VARCHAR(255) NULL,
  ADD COLUMN reset_token_expires DATETIME NULL;
-- Añadir índice para login
CREATE INDEX idx_cliente_nombre_usuario ON cliente(nombre_usuario);
-- fecha de registro
ALTER TABLE cliente ADD COLUMN fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

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

-- PROPIEDADES
CREATE TABLE propiedad (
    id_propiedad INT PRIMARY KEY AUTO_INCREMENT,
    tipo_propiedad ENUM('Casa', 'Apartamento', 'Lote') NOT NULL,
    direccion_formato VARCHAR(200) NOT NULL,
    precio_propiedad DECIMAL(15,2) NOT NULL,
    area_m2 DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    estado_propiedad ENUM('Disponible', 'Reservada', 'Vendida') DEFAULT 'Disponible',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_venta DATE NULL,
    id_barrio INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_barrio) REFERENCES barrio(id_barrio),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);
ALTER TABLE propiedad 
ADD COLUMN num_habitaciones INT NULL AFTER area_m2,
ADD COLUMN num_banos INT NULL AFTER num_habitaciones;


CREATE TABLE reporte_ventas (
    id_reporte INT PRIMARY KEY AUTO_INCREMENT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    total_ventas DECIMAL(15,2),
    id_usuario INT NOT NULL,
    estado_reporte ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);


-- 10. Tabla Historial de Estados de Propiedad
CREATE TABLE historial_estado_propiedad (
    id_historial INT PRIMARY KEY AUTO_INCREMENT,
    estado_anterior ENUM('Disponible', 'Reservada', 'Vendida'),
    estado_nuevo ENUM('Disponible', 'Reservada', 'Vendida'),
    fecha_cambio DATETIME DEFAULT CURRENT_TIMESTAMP,
    justificacion TEXT,
    id_propiedad INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);


-- 11. Tabla Interacciones con Clientes (llamadas, visitas, mensajes)
CREATE TABLE interaccion_cliente (
    id_interaccion INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    id_usuario INT NOT NULL,
    tipo_interaccion ENUM('Llamada', 'Mensaje', 'Visita') NOT NULL,
    notas TEXT,
    fecha_interaccion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);


-- CONTRATOS
CREATE TABLE contrato (
    id_contrato INT PRIMARY KEY AUTO_INCREMENT,
    fecha_contrato DATE NOT NULL,
    valor_venta DECIMAL(15,2) NOT NULL,
    fecha_venta DATE NOT NULL,
    archivo_pdf VARCHAR(255),
    id_propiedad INT NOT NULL,
    id_cliente INT NOT NULL,
    id_usuario INT NOT NULL,
    estado_contrato ENUM('Activo', 'Anulado', 'Finalizado') DEFAULT 'Activo',
    FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);


CREATE TABLE auditoria (
    id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
    tabla_afectada VARCHAR(50) NOT NULL,
    accion VARCHAR(20) NOT NULL,
    descripcion TEXT,
    usuario_accion VARCHAR(100),
    fecha_accion DATETIME DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE auditoria
ADD COLUMN fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE auditoria 
ADD COLUMN tabla VARCHAR(50) AFTER id_auditoria;


CREATE TABLE interes_propiedad (
  id_interes INT PRIMARY KEY AUTO_INCREMENT,
  id_propiedad INT NOT NULL,
  id_cliente INT NULL, -- FK a cliente.id_cliente si cliente no autenticado, o a usuario si migras
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
);


CREATE TABLE visita (
  id_visita INT PRIMARY KEY AUTO_INCREMENT,
  id_propiedad INT NOT NULL,
  id_cliente INT NOT NULL,
  id_agente INT NOT NULL,
  fecha_visita DATETIME NOT NULL,
  estado ENUM('Pendiente','Confirmada','Realizada','Cancelada') DEFAULT 'Pendiente',
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad),
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
  FOREIGN KEY (id_agente) REFERENCES usuario(id_usuario)
);

ALTER TABLE visita
ADD COLUMN hora_visita TIME NULL AFTER fecha_visita;

ALTER TABLE visita
MODIFY COLUMN estado VARCHAR(50) NOT NULL DEFAULT 'Programada';

ALTER TABLE visita 
ADD COLUMN recordatorio_enviado TINYINT(1) DEFAULT 0;

CREATE INDEX idx_visita_cliente_fecha ON visita (id_cliente, fecha_visita);

CREATE TABLE imagen_propiedad (
  id_imagen INT PRIMARY KEY AUTO_INCREMENT,
  id_propiedad INT NOT NULL,
  url VARCHAR(512) NOT NULL,
  prioridad INT DEFAULT 0,
  descripcion VARCHAR(255),
  fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad)
);


CREATE TABLE notificacion (
  id_notificacion INT PRIMARY KEY AUTO_INCREMENT,
  tipo ENUM('EMAIL','WHATSAPP','SMS','PUSH'),
  canal VARCHAR(50),
  destinatario VARCHAR(255),
  asunto VARCHAR(255),
  contenido TEXT,
  estado ENUM('Enviado','Error','Pendiente') DEFAULT 'Pendiente',
  referencia_tipo VARCHAR(50), -- 'interes','visita','contrato', etc.
  referencia_id INT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE busqueda (
  id_busqueda INT PRIMARY KEY AUTO_INCREMENT,
  query_text VARCHAR(500),
  filtros JSON,
  id_usuario INT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);