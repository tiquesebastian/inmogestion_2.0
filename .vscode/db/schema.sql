-- Estructura de la base de datos para InmoGestión

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS inmogestion;
USE inmogestion;

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

-- Tabla de usuarios con campos mejorados para gestión de acceso
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255) NULL,
    reset_token_expires DATETIME NULL,
    id_rol INT,
    estado ENUM('Activo', 'Inactivo', 'Bloqueado') DEFAULT 'Activo',
    ultima_sesion DATETIME NULL,
    intentos_fallidos INT DEFAULT 0,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- Índices optimizados para búsquedas frecuentes
ALTER TABLE usuario ADD INDEX idx_correo_estado (correo, estado);
ALTER TABLE usuario ADD INDEX idx_nombre_usuario_estado (nombre_usuario, estado);
ALTER TABLE usuario ADD INDEX idx_ultima_sesion (ultima_sesion);

-- Tabla de auditoría para seguimiento de cambios
CREATE TABLE IF NOT EXISTS auditoria (
    id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
    tabla_afectada VARCHAR(50) NOT NULL,
    accion VARCHAR(20) NOT NULL,
    descripcion TEXT,
    usuario_accion VARCHAR(100),
    ip_origen VARCHAR(45) NULL,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    datos_anteriores JSON NULL,
    datos_nuevos JSON NULL
);

-- Tabla de sesiones para control de acceso
CREATE TABLE IF NOT EXISTS sesiones (
    id_sesion INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NOT NULL,
    ip_origen VARCHAR(45) NULL,
    dispositivo VARCHAR(255) NULL,
    estado ENUM('Activa', 'Expirada', 'Cerrada') DEFAULT 'Activa',
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabla de propiedades con campos mejorados
CREATE TABLE IF NOT EXISTS propiedad (
    id_propiedad INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(12,2),
    direccion TEXT,
    tipo VARCHAR(50),
    estado VARCHAR(50),
    id_agente INT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_agente) REFERENCES usuario(id_usuario)
);

-- Tabla de visitas
CREATE TABLE IF NOT EXISTS visita (
    id_visita INT PRIMARY KEY AUTO_INCREMENT,
    id_propiedad INT,
    id_cliente INT,
    id_agente INT,
    fecha_visita DATETIME,
    estado VARCHAR(50),
    notas TEXT,
    FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad),
    FOREIGN KEY (id_cliente) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_agente) REFERENCES usuario(id_usuario)
);

-- Tabla de contratos
CREATE TABLE IF NOT EXISTS contrato (
    id_contrato INT PRIMARY KEY AUTO_INCREMENT,
    id_propiedad INT,
    id_cliente INT,
    id_agente INT,
    tipo_contrato VARCHAR(50),
    fecha_inicio DATE,
    fecha_fin DATE,
    valor DECIMAL(12,2),
    estado VARCHAR(50),
    FOREIGN KEY (id_propiedad) REFERENCES propiedad(id_propiedad),
    FOREIGN KEY (id_cliente) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_agente) REFERENCES usuario(id_usuario)
);

-- Triggers para auditoría
DELIMITER //

CREATE TRIGGER trg_auditoria_acceso_usuario
AFTER UPDATE ON usuario
FOR EACH ROW
BEGIN
    IF NEW.estado != OLD.estado OR NEW.intentos_fallidos != OLD.intentos_fallidos THEN
        INSERT INTO auditoria (
            tabla_afectada, 
            accion, 
            descripcion, 
            usuario_accion,
            datos_anteriores,
            datos_nuevos
        ) VALUES (
            'usuario', 
            'CAMBIO_ESTADO',
            CONCAT('Usuario ID:', OLD.id_usuario, ' modificado'),
            CURRENT_USER(),
            JSON_OBJECT(
                'estado', OLD.estado,
                'intentos_fallidos', OLD.intentos_fallidos
            ),
            JSON_OBJECT(
                'estado', NEW.estado,
                'intentos_fallidos', NEW.intentos_fallidos
            )
        );
    END IF;
END //

-- Procedimiento para registro de usuarios
CREATE PROCEDURE sp_registrar_usuario(
    IN p_nombre VARCHAR(100),
    IN p_apellido VARCHAR(100),
    IN p_correo VARCHAR(100),
    IN p_telefono VARCHAR(20),
    IN p_nombre_usuario VARCHAR(50),
    IN p_contrasena VARCHAR(255),
    IN p_id_rol INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al registrar usuario';
    END;

    START TRANSACTION;
        INSERT INTO usuario (
            nombre, 
            apellido, 
            correo, 
            telefono, 
            nombre_usuario, 
            contrasena, 
            estado, 
            id_rol
        ) VALUES (
            p_nombre,
            p_apellido,
            p_correo,
            p_telefono,
            p_nombre_usuario,
            p_contrasena,
            'Activo',
            p_id_rol
        );

        INSERT INTO auditoria (
            tabla_afectada,
            accion,
            descripcion,
            usuario_accion
        ) VALUES (
            'usuario',
            'REGISTRO',
            CONCAT('Nuevo usuario registrado: ', p_nombre_usuario),
            CURRENT_USER()
        );
    COMMIT;
END //

-- Procedimiento para inicio de sesión
CREATE PROCEDURE sp_iniciar_sesion(
    IN p_nombre_usuario VARCHAR(50),
    IN p_ip VARCHAR(45),
    IN p_dispositivo VARCHAR(255)
)
BEGIN
    DECLARE v_id_usuario INT;
    DECLARE v_estado VARCHAR(20);
    
    SELECT id_usuario, estado 
    INTO v_id_usuario, v_estado
    FROM usuario 
    WHERE nombre_usuario = p_nombre_usuario;
    
    IF v_estado = 'Activo' THEN
        UPDATE usuario 
        SET ultima_sesion = NOW(), 
            intentos_fallidos = 0 
        WHERE id_usuario = v_id_usuario;
        
        INSERT INTO sesiones (
            id_usuario, 
            token, 
            fecha_expiracion, 
            ip_origen, 
            dispositivo
        ) VALUES (
            v_id_usuario, 
            UUID(), 
            DATE_ADD(NOW(), INTERVAL 24 HOUR), 
            p_ip, 
            p_dispositivo
        );
    END IF;
END //

DELIMITER ;

-- Vistas para gestión
CREATE OR REPLACE VIEW vista_usuarios_activos AS
SELECT 
    u.id_usuario,
    u.nombre,
    u.apellido,
    u.correo,
    u.telefono,
    u.nombre_usuario,
    u.estado,
    r.nombre as rol,
    u.ultima_sesion,
    u.fecha_registro,
    COALESCE(s.sesiones_activas, 0) as sesiones_activas
FROM usuario u
JOIN roles r ON u.id_rol = r.id_rol
LEFT JOIN (
    SELECT id_usuario, COUNT(*) as sesiones_activas 
    FROM sesiones 
    WHERE estado = 'Activa' 
    GROUP BY id_usuario
) s ON u.id_usuario = s.id_usuario
WHERE u.estado = 'Activo';

-- Insertar roles básicos
INSERT INTO roles (nombre, descripcion) VALUES
('Administrador', 'Control total del sistema'),
('Agente', 'Gestión de propiedades y clientes'),
('Cliente', 'Usuario final interesado en propiedades');

-- Insertar usuario administrador por defecto
-- Contraseña: admin123 (debe ser hasheada en producción)
INSERT INTO usuario (nombre, apellido, correo, nombre_usuario, contrasena, id_rol) VALUES
('Admin', 'Sistema', 'admin@inmogestion.com', 'admin', '$2a$10$xkUFJB.x5V6y8X0P5H5H5O5H5H5O5H5H5O5H5H5', 1);