Script de base de datos:
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



CONSULTAS


-- ==========================================================
-- 4. CONSULTAS DE VERIFICACIÓN
-- ==========================================================
SELECT * FROM rol;
SELECT * FROM usuario;
SELECT * FROM cliente;
SELECT * FROM localidad;
SELECT * FROM barrio;
SELECT * FROM propiedad;
SELECT * FROM reporte_ventas;
SELECT * FROM historial_estado_propiedad;
SELECT * FROM interaccion_cliente;
SELECT * FROM contrato;


-- vistas mas importantantes
SELECT * FROM vista_propiedades_mas_vendidas;
SELECT * FROM vista_ventas_por_usuario;
SELECT * FROM vista_clientes_mas_activos;
SELECT * FROM vista_historial_cambios_propiedades;
SELECT * FROM vista_localidades_mas_activas_en_ventas;
SELECT * FROM vista_ventas_por_localidad_y_mes;


-- Consultar propiedades disponibles
SELECT * FROM vista_propiedades_disponibles;

-- Consultar propiedades disponibles (versión 2, si existe)
SELECT * FROM vista_propiedades_disponibles;

-- Consultar clientes activos
SELECT * FROM vista_clientes_activos;

-- Consultar contratos activos
SELECT * FROM vista_contratos_activos;



SELECT * FROM auditoria ORDER BY fecha_accion DESC;


-- ver procedimientos existentes
SHOW PROCEDURE STATUS WHERE Db = 'inmogestion';

DESCRIBE auditoria;




-- 1. Ver todos los registros de auditoría
SELECT * 
FROM auditoria
ORDER BY fecha DESC;

-- 2. Ver las últimas 10 acciones realizadas en el sistema
SELECT * 
FROM auditoria
ORDER BY fecha DESC
LIMIT 10;

-- 3. Filtrar solo las acciones de clientes
SELECT * 
FROM auditoria
WHERE tabla = 'cliente'
ORDER BY fecha DESC;

-- 4. Ver solo las eliminaciones realizadas en cualquier tabla
SELECT * 
FROM auditoria
WHERE accion = 'DELETE'
ORDER BY fecha DESC;

-- 5. Contar cuántos registros se insertaron en propiedades
SELECT COUNT(*) AS total_inserts_propiedades
FROM auditoria
WHERE tabla = 'propiedad' AND accion = 'INSERT';



TRIGERRS

DROP TRIGGER IF EXISTS trg_cliente_insert;

-- CLIENTES

CREATE TRIGGER trg_cliente_insert
AFTER INSERT ON cliente
FOR EACH ROW
INSERT INTO auditoria(tabla, accion, descripcion)
VALUES ('cliente', 'INSERT', CONCAT('Se creó el cliente ID=', NEW.id_cliente, ' Nombre=', NEW.nombre_cliente));

SHOW TRIGGERS LIKE 'cliente';



CREATE TRIGGER trg_cliente_update
AFTER UPDATE ON cliente
FOR EACH ROW
INSERT INTO auditoria(tabla, accion, descripcion)
VALUES ('cliente', 'UPDATE', CONCAT('Se actualizó el cliente ID=', NEW.id_cliente));



CREATE TRIGGER trg_cliente_delete
AFTER DELETE ON cliente
FOR EACH ROW
INSERT INTO auditoria(tabla, accion, descripcion)
VALUES ('cliente', 'DELETE', CONCAT('Se eliminó el cliente ID=', OLD.id_cliente, ' Nombre=', OLD.nombre_cliente));




-- PROPIEDAD

CREATE TRIGGER trg_propiedad_insert
AFTER INSERT ON propiedad
FOR EACH ROW
INSERT INTO auditoria(tabla, accion, descripcion)
VALUES ('propiedad', 'INSERT', CONCAT('Se creó la propiedad ID=', NEW.id_propiedad, ' Tipo=', NEW.tipo_propiedad, ' Dirección=', NEW.direccion_formato));


CREATE TRIGGER trg_propiedad_update
AFTER UPDATE ON propiedad
FOR EACH ROW
INSERT INTO auditoria(tabla, accion, descripcion)
VALUES ('propiedad', 'UPDATE', CONCAT('Se actualizó la propiedad ID=', NEW.id_propiedad, ' Estado=', NEW.estado_propiedad));


CREATE TRIGGER trg_propiedad_delete
AFTER DELETE ON propiedad
FOR EACH ROW
INSERT INTO auditoria(tabla, accion, descripcion)
VALUES ('propiedad', 'DELETE', CONCAT('Se eliminó la propiedad ID=', OLD.id_propiedad, ' Tipo=', OLD.tipo_propiedad));

-- CONTRATOS

CREATE TRIGGER trg_contrato_insert
AFTER INSERT ON contrato
FOR EACH ROW
INSERT INTO auditoria(tabla, accion, descripcion)
VALUES ('contrato', 'INSERT', CONCAT('Se creó el contrato ID=', NEW.id_contrato, ' para la propiedad ID=', NEW.id_propiedad, ' con el cliente ID=', NEW.id_cliente));


CREATE TRIGGER trg_contrato_update
AFTER UPDATE ON contrato
FOR EACH ROW
INSERT INTO auditoria(tabla, accion, descripcion)
VALUES ('contrato', 'UPDATE', CONCAT('Se actualizó el contrato ID=', NEW.id_contrato, ' Estado=', NEW.estado_contrato));


CREATE TRIGGER trg_contrato_delete
AFTER DELETE ON contrato
FOR EACH ROW
INSERT INTO auditoria(tabla, accion, descripcion)
VALUES ('contrato', 'DELETE', CONCAT('Se eliminó el contrato ID=', OLD.id_contrato, ' con propiedad ID=', OLD.id_propiedad));

-- reportes

CREATE TRIGGER trg_reporte_insert
AFTER INSERT ON reporte_ventas
FOR EACH ROW
INSERT INTO auditoria(tabla, accion, descripcion)
VALUES (
  'reporte_ventas',
  'INSERT',
  CONCAT('Se generó el reporte ID=', NEW.id_reporte, 
         ' desde ', NEW.fecha_inicio, ' hasta ', NEW.fecha_fin, 
         ' por usuario ID=', NEW.id_usuario)
);

CREATE TRIGGER trg_reporte_update
AFTER UPDATE ON reporte_ventas
FOR EACH ROW
INSERT INTO auditoria(tabla, accion, descripcion)
VALUES (
  'reporte_ventas',
  'UPDATE',
  CONCAT('Se actualizó el reporte ID=', NEW.id_reporte, 
         ' nuevo estado=', NEW.estado_reporte)
);

CREATE TRIGGER trg_reporte_delete
AFTER DELETE ON reporte_ventas
FOR EACH ROW
INSERT INTO auditoria(tabla, accion, descripcion)
VALUES (
  'reporte_ventas',
  'DELETE',
  CONCAT('Se eliminó el reporte ID=', OLD.id_reporte, 
         ' generado por usuario ID=', OLD.id_usuario)
);



-- =====================================================
-- 7. TRIGGERS PARA INTERACCION_CLIENTE
-- =====================================================
CREATE TRIGGER trg_interaccion_insert
AFTER INSERT ON interaccion_cliente
FOR EACH ROW
INSERT INTO auditoria(tabla, accion, descripcion)
VALUES ('interaccion_cliente', 'INSERT',
        CONCAT('Nueva interacción ID=', NEW.id_interaccion, 
               ' con cliente ID=', NEW.id_cliente, 
               ' tipo=', NEW.tipo_interaccion));

CREATE TRIGGER trg_interaccion_update
AFTER UPDATE ON interaccion_cliente
FOR EACH ROW
INSERT INTO auditoria(tabla, accion, descripcion)
VALUES ('interaccion_cliente', 'UPDATE',
        CONCAT('Interacción ID=', NEW.id_interaccion, 
               ' actualizada: tipo=', NEW.tipo_interaccion, 
               ' notas=', NEW.notas));

CREATE TRIGGER trg_interaccion_delete
AFTER DELETE ON interaccion_cliente
FOR EACH ROW
INSERT INTO auditoria(tabla, accion, descripcion)
VALUES ('interaccion_cliente', 'DELETE',
        CONCAT('Se eliminó interacción ID=', OLD.id_interaccion, 
               ' cliente ID=', OLD.id_cliente));


VISTAS Y PROCEDIMIENTOS


-- VISTAS Y PROCEDIMIENTOS

-- Vista de clientes activos
CREATE VIEW vista_clientes_activos AS
SELECT id_cliente, nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente
FROM cliente
WHERE estado_cliente = 'Activo';

-- Vista de propiedades disponibles
CREATE VIEW vista_propiedades_disponibles AS
SELECT p.id_propiedad, p.tipo_propiedad, p.direccion_formato, p.precio_propiedad, p.area_m2,
       p.estado_propiedad, b.nombre_barrio, l.nombre_localidad, u.nombre AS agente
FROM propiedad p
JOIN barrio b ON p.id_barrio = b.id_barrio
JOIN localidad l ON b.id_localidad = l.id_localidad
JOIN usuario u ON p.id_usuario = u.id_usuario
WHERE p.estado_propiedad = 'Disponible';

-- Vista de contratos con cliente y agente
CREATE VIEW vista_contratos_detallados AS
SELECT c.id_contrato, c.fecha_contrato, c.valor_venta, c.estado_contrato,
       cli.nombre_cliente, cli.apellido_cliente,
       p.tipo_propiedad, p.direccion_formato,
       u.nombre AS agente, u.apellido AS agente_apellido
FROM contrato c
JOIN cliente cli ON c.id_cliente = cli.id_cliente
JOIN propiedad p ON c.id_propiedad = p.id_propiedad
JOIN usuario u ON c.id_usuario = u.id_usuario;


-- Procedimiento: Insertar nuevo cliente
DELIMITER //
CREATE PROCEDURE sp_insertar_cliente (
    IN p_nombre VARCHAR(50),
    IN p_apellido VARCHAR(50),
    IN p_documento VARCHAR(20),
    IN p_correo VARCHAR(100),
    IN p_telefono VARCHAR(20)
)
BEGIN
    INSERT INTO cliente (nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente, estado_cliente)
    VALUES (p_nombre, p_apellido, p_documento, p_correo, p_telefono, 'Activo');
END //
DELIMITER ;

-- Procedimiento: Obtener propiedades por rango de precio
DELIMITER //
CREATE PROCEDURE sp_propiedades_por_precio (
    IN precio_min DECIMAL(15,2),
    IN precio_max DECIMAL(15,2)
)
BEGIN
    SELECT * FROM propiedad
    WHERE precio_propiedad BETWEEN precio_min AND precio_max;
END //
DELIMITER ;

-- Procedimiento: Total de contratos por agente
DELIMITER //
CREATE PROCEDURE sp_total_contratos_por_agente (
    IN p_id_usuario INT
)
BEGIN
    SELECT u.nombre, u.apellido, COUNT(c.id_contrato) AS total_contratos
    FROM contrato c
    JOIN usuario u ON c.id_usuario = u.id_usuario
    WHERE u.id_usuario = p_id_usuario
    GROUP BY u.id_usuario;
END //
DELIMITER ;


-- Total de ventas por agente
SELECT u.nombre, u.apellido, COUNT(c.id_contrato) AS contratos, SUM(c.valor_venta) AS total_ventas
FROM contrato c
JOIN usuario u ON c.id_usuario = u.id_usuario
GROUP BY u.id_usuario;

-- Propiedad más costosa
SELECT tipo_propiedad, direccion_formato, MAX(precio_propiedad) AS precio_maximo
FROM propiedad;

-- Número de clientes activos vs inactivos
SELECT estado_cliente, COUNT(*) AS total
FROM cliente
GROUP BY estado_cliente;


INSERTS DE LAS TABLAS: (OJO REVISAR LOS ID Y SELECTS PREVIAMENTE)

-- roles de usuario
INSERT INTO rol (nombre_rol) VALUES 
('Administrador'),
('Agente');

-- registros de usuario
INSERT INTO usuario (nombre, apellido, correo, telefono, nombre_usuario, contrasena, estado, id_rol) VALUES
('Carlos', 'Ramírez', 'carlos.ramirez@example.com', '555-1234', 'carlosr', 'contrasena123', 'Activo', 1),
('Ana', 'López', 'ana.lopez@example.com', '555-2345', 'anal', 'contrasena123', 'Activo', 2),
('Luis', 'Martínez', 'luis.martinez@example.com', '555-3456', 'luism', 'contrasena123', 'Activo', 2),
('María', 'Gómez', 'maria.gomez@example.com', '555-4567', 'mariag', 'contrasena123', 'Inactivo', 2),
('Pedro', 'Fernández', 'pedro.fernandez@example.com', '555-5678', 'pedrof', 'contrasena123', 'Activo', 1),
('Laura', 'Torres', 'laura.torres@example.com', '555-6789', 'laurat', 'contrasena123', 'Activo', 2),
('Jorge', 'Núñez', 'jorge.nunez@example.com', '555-7890', 'jorgen', 'contrasena123', 'Activo', 2),
('Elena', 'Morales', 'elena.morales@example.com', '555-8901', 'elenam', 'contrasena123', 'Inactivo', 2),
('Sofía', 'Hernández', 'sofia.hernandez@example.com', '555-9012', 'sofiah', 'contrasena123', 'Activo', 2),
('Miguel', 'Vargas', 'miguel.vargas@example.com', '555-0123', 'miguelv', 'contrasena123', 'Activo', 1);


-- clientes 
INSERT INTO cliente (nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente, estado_cliente) VALUES
('Juan', 'Pérez', '100100001', 'juan.perez1@example.com', '3001110001', 'Activo'),
('Ana', 'Gómez', '100100002', 'ana.gomez2@example.com', '3001110002', 'Activo'),
('Carlos', 'Ramírez', '100100003', 'carlos.ramirez3@example.com', '3001110003', 'Activo'),
('Laura', 'Martínez', '100100004', 'laura.martinez4@example.com', '3001110004', 'Activo'),
('Luis', 'Fernández', '100100005', 'luis.fernandez5@example.com', '3001110005', 'Activo'),
('Sofía', 'Torres', '100100006', 'sofia.torres6@example.com', '3001110006', 'Activo'),
('Andrés', 'Suárez', '100100007', 'andres.suarez7@example.com', '3001110007', 'Activo'),
('Mariana', 'Vargas', '100100008', 'mariana.vargas8@example.com', '3001110008', 'Activo'),
('Felipe', 'Castro', '100100009', 'felipe.castro9@example.com', '3001110009', 'Activo'),
('Natalia', 'Cortés', '100100010', 'natalia.cortes10@example.com', '3001110010', 'Inactivo'),
('Jorge', 'Moreno', '100100011', 'jorge.moreno11@example.com', '3001110011', 'Activo'),
('Camila', 'Rojas', '100100012', 'camila.rojas12@example.com', '3001110012', 'Activo'),
('David', 'López', '100100013', 'david.lopez13@example.com', '3001110013', 'Activo'),
('Paula', 'Mendoza', '100100014', 'paula.mendoza14@example.com', '3001110014', 'Activo'),
('Santiago', 'García', '100100015', 'santiago.garcia15@example.com', '3001110015', 'Activo'),
('Valentina', 'Ortega', '100100016', 'valentina.ortega16@example.com', '3001110016', 'Activo'),
('Diego', 'Jiménez', '100100017', 'diego.jimenez17@example.com', '3001110017', 'Inactivo'),
('Daniela', 'Navarro', '100100018', 'daniela.navarro18@example.com', '3001110018', 'Activo'),
('Ricardo', 'Mejía', '100100019', 'ricardo.mejia19@example.com', '3001110019', 'Activo'),
('Andrea', 'Santos', '100100020', 'andrea.santos20@example.com', '3001110020', 'Activo'),
('Manuel', 'Reyes', '100100021', 'manuel.reyes21@example.com', '3001110021', 'Activo'),
('Juliana', 'Carrillo', '100100022', 'juliana.carrillo22@example.com', '3001110022', 'Activo'),
('Tomás', 'Silva', '100100023', 'tomas.silva23@example.com', '3001110023', 'Activo'),
('Isabela', 'Álvarez', '100100024', 'isabela.alvarez24@example.com', '3001110024', 'Activo'),
('Sebastián', 'Paredes', '100100025', 'sebastian.paredes25@example.com', '3001110025', 'Inactivo'),
('Carolina', 'Rincón', '100100026', 'carolina.rincon26@example.com', '3001110026', 'Activo'),
('Alejandro', 'Delgado', '100100027', 'alejandro.delgado27@example.com', '3001110027', 'Activo'),
('Gabriela', 'León', '100100028', 'gabriela.leon28@example.com', '3001110028', 'Activo'),
('Mateo', 'Nieto', '100100029', 'mateo.nieto29@example.com', '3001110029', 'Activo'),
('Lucía', 'Salazar', '100100030', 'lucia.salazar30@example.com', '3001110030', 'Activo');

-- localidades
INSERT INTO localidad (nombre_localidad) VALUES
('Usaquén'),
('Chapinero'),
('Santa Fe'),
('San Cristóbal'),
('Usme'),
('Tunjuelito'),
('Bosa'),
('Kennedy'),
('Fontibón'),
('Engativá'),
('Suba'),
('Barrios Unidos'),
('Teusaquillo'),
('Los Mártires'),
('Antonio Nariño'),
('Puente Aranda'),
('La Candelaria'),
('Rafael Uribe Uribe'),
('Ciudad Bolívar'),
('Sumapaz');


-- Barrrios por localidad con ejemplos de códigos postales

INSERT INTO barrio (nombre_barrio, codigo_postal, id_localidad) VALUES
-- Usaquén (localidad 1)
('Santa Bárbara', '110121', 1),
('Cedritos', '110121', 1),
('Bella Suiza', '110121', 1),

-- Chapinero (localidad 2)
('Rosales', '110211', 2),
('El Nogal', '110211', 2),
('El Chicó', '110211', 2),

-- Santa Fe (localidad 3)
('La Candelaria', '110311', 3),
('Las Nieves', '110311', 3),
('La Macarena', '110311', 3),

-- San Cristóbal (localidad 4)
('San Blas', '110411', 4),
('La Victoria', '110411', 4),
('Los Libertadores', '110411', 4),

-- Usme (localidad 5)
('El Bosque', '110511', 5),
('Gran Yomasa', '110511', 5),
('Comuneros', '110511', 5),

-- Tunjuelito (localidad 6)
('San Benito', '110611', 6),
('Venecia', '110611', 6),
('Abraham Lincoln', '110611', 6),

-- Bosa (localidad 7)
('Bosa Centro', '110711', 7),
('Bosa Occidental', '110711', 7),
('Bosa Nova', '110711', 7),

-- Kennedy (localidad 8)
('Patio Bonito', '110811', 8),
('Corabastos', '110811', 8),
('Tintalá', '110811', 8),

-- Fontibón (localidad 9)
('Fontibón Centro', '110911', 9),
('Modelia', '110911', 9),
('El Recreo', '110911', 9),

-- Engativá (localidad 10)
('Minuto de Dios', '111011', 10),
('Villa Luz', '111011', 10),
('Engativá Centro', '111011', 10),

-- Suba (localidad 11)
('Suba Centro', '111111', 11),
('Niza', '111111', 11),
('Prado Veraniego', '111111', 11),

-- Barrios Unidos (localidad 12)
('La Castellana', '111211', 12),
('Los Andes', '111211', 12),
('Polo Club', '111211', 12),

-- Teusaquillo (localidad 13)
('Teusaquillo', '111311', 13),
('La Esmeralda', '111311', 13),
('Galerías', '111311', 13),

-- Los Mártires (localidad 14)
('Santa Isabel', '111411', 14),
('Voto Nacional', '111411', 14),
('Paloquemao', '111411', 14),

-- Antonio Nariño (localidad 15)
('Restrepo', '111511', 15),
('San Jorge', '111511', 15),
('Ciudad Berna', '111511', 15),

-- Puente Aranda (localidad 16)
('Puente Aranda', '111611', 16),
('Zona Industrial', '111611', 16),
('Montevideo', '111611', 16),

-- La Candelaria (localidad 17)
('Belén', '111711', 17),
('Egipto', '111711', 17),
('Las Aguas', '111711', 17),

-- Rafael Uribe Uribe (localidad 18)
('Quiroga', '111811', 18),
('Molinos', '111811', 18),
('Diana Turbay', '111811', 18),

-- Ciudad Bolívar (localidad 19)
('Arborizadora', '110711', 19),  -- aunque código exacto varía, se toma como ejemplo general
('La Pradera del Norte', '110711', 19),
('El Redil', '110711', 19),

-- Sumapaz (localidad 20)
('Sector Betania', '190001', 20),  -- código postal estimado ya que Sumapaz usa rangos rurales
('Sector Salamanca', '190002', 20
('Sector Veredal', '190003', 20);

INSERT INTO propiedad
(tipo_propiedad, direccion_formato, precio_propiedad, area_m2, descripcion, estado_propiedad, fecha_venta, id_barrio, id_usuario)
VALUES
-- 1
('Apartamento', 'Cll 160 Nº 15‑23, Cedritos, Usaquén', 450000000.00, 85.00, 'Apartamento moderno con balcón y buena iluminación', 'Disponible', NULL, 2, 1),
-- 2
('Apartamento', 'Cll 85 Nº 14‑40, El Chicó, Chapinero', 850000000.00, 120.00, 'Amplio apartamento en zona exclusiva', 'Reservada', NULL, 4, 2),
-- 3
('Casa', 'Cll 12 Nº 2‑18, La Candelaria, Santa Fe', 600000000.00, 200.00, 'Casa colonial restaurada', 'Disponible', NULL, 17, 3),
-- 4
('Apartamento', 'Cll 22B Sur Nº 4‑15, San Blas, San Cristóbal', 250000000.00, 70.00, 'Apartamento funcional ideal para pareja', 'Vendida', '2025-08-01', 10, 4),
-- 5
('Lote', 'Transversal 18 Sur, El Bosque, Usme', 150000000.00, 300.00, 'Lote para construcción residencial', 'Disponible', NULL, 13, 5),
-- 6
('Casa', 'Cll 44 Sur Nº 70‑20, Patio Bonito, Kennedy', 350000000.00, 130.00, 'Casa familiar con jardín', 'Reservada', NULL, 4, 6),
-- 7
('Apartamento', 'Av. Eldorado Nº 103‑21, Modelia, Fontibón', 500000000.00, 90.00, 'Apartamento céntrico y bien conservado', 'Disponible', NULL, 11, 7),
-- 8
('Casa', 'Cll 63 Nº 68‑30, Minuto de Dios, Engativá', 400000000.00, 110.00, 'Casa con patio y zona tranquila', 'Disponible', NULL, 4, 8),
-- 9
('Apartamento', 'Cll 170 Nº 52‑45, Niza, Suba', 550000000.00, 100.00, 'Apartamento con buena vista y parqueadero', 'Vendida', '2025-07-15', 4, 9),
-- 10
('Apartamento', 'Cll 68 Nº 15‑80, Polo Club, Barrios Unidos', 480000000.00, 95.00, 'Apartamento bien ubicado, cerca a parques', 'Disponible', NULL, 14, 10),
-- 11
('Casa', 'Cll 45 Nº 22‑10, Teusaquillo, Teusaquillo', 650000000.00, 180.00, 'Casa tradicional con amplio salón', 'Disponible', NULL, 13, 1),
-- 12
('Apartamento', 'Cll 24 Sur Nº 14‑55, Restrepo, Antonio Nariño', 300000000.00, 75.00, 'Apartamento económico, buena ubicación', 'Reservada', NULL, 18, 2),
-- 13
('Lote', 'Cll 24 Sur Nº 30‑10, Zona Industrial, Puente Aranda', 200000000.00, 250.00, 'Lote para negocio o vivienda', 'Disponible', NULL, 19, 3),
-- 14
('Casa', 'Cll 11 Nº 3‑45, Belén, La Candelaria', 700000000.00, 210.00, 'Casa en centro histórico', 'Disponible', NULL, 17, 4),
-- 15
('Apartamento', 'Cll 33 Sur Nº 21‑30, Quiroga, Rafael Uribe', 320000000.00, 80.00, 'Apartamento acogedor con buena ventilación', 'Disponible', NULL, 18, 5),
-- 16
('Lote', 'Cll 80 Sur Nº 40‑10, Arborizadora Alta, Ciudad Bolívar', 180000000.00, 350.00, 'Lote amplio en zona de expansión', 'Disponible', NULL, 19, 6),
-- 17
('Apartamento', 'Cll 142 Nº 48‑25, Prado Veraniego, Suba', 520000000.00, 105.00, 'Apartamento moderno con parqueadero', 'Reservada', NULL, 12, 7),
-- 18
('Casa', 'Cll 54 Sur Nº 81‑10, Castilla, Kennedy', 330000000.00, 120.00, 'Casa tradicional con patio', 'Disponible', NULL, 8, 8),
-- 19
('Apartamento', 'Cll 65 Nº 19‑30, Baquero, Barrios Unidos', 470000000.00, 90.00, 'Apartamento cerca a parques y colegios', 'Disponible', NULL, 14, 9),
-- 20
('Apartamento', 'Cll 100 Nº 60‑20, Bochica Compartir, Engativá', 260000000.00, 68.00, 'Apartamento en conjunto residencial', 'Disponible', NULL, 15, 10);




INSERT INTO historial_estado_propiedad
(estado_anterior, estado_nuevo, fecha_cambio, justificacion, id_propiedad, id_usuario)
VALUES
('Disponible', 'Reservada', '2025-07-01 10:00:00', 'Cliente interesado, en proceso de separación.', 21, 1),
('Reservada', 'Vendida', '2025-08-01 15:30:00', 'Compra finalizada y escrituras firmadas.', 21, 2),

('Disponible', 'Reservada', '2025-06-15 09:45:00', 'Reservada por cliente con crédito aprobado.', 22, 3),
('Reservada', 'Vendida', '2025-07-10 13:00:00', 'Venta concretada con pago total.', 22, 4),

('Disponible', 'Vendida', '2025-07-05 11:00:00', 'Venta rápida por oferta directa.', 23, 5),

('Disponible', 'Reservada', '2025-07-20 14:20:00', 'Negociación avanzada, a espera de firma.', 24, 6),
('Reservada', 'Disponible', '2025-08-01 16:00:00', 'Cliente se retiró antes de firmar contrato.', 24, 7),

('Disponible', 'Reservada', '2025-06-10 10:30:00', 'Cliente extranjero solicitó reserva.', 25, 8),

('Reservada', 'Vendida', '2025-07-01 17:00:00', 'Trámite de escrituración completado.', 25, 9),

('Disponible', 'Reservada', '2025-05-01 12:00:00', 'Proceso de compra iniciado.', 26, 10),

('Disponible', 'Reservada', '2025-08-15 09:15:00', 'Cliente interesado dejó depósito.', 27, 1),
('Reservada', 'Vendida', '2025-09-01 11:30:00', 'Venta finalizada tras aprobación de crédito.', 27, 2),

('Disponible', 'Reservada', '2025-07-25 08:30:00', 'Cliente en etapa de análisis financiero.', 28, 3),
('Reservada', 'Disponible', '2025-08-10 14:45:00', 'Cliente canceló su interés.', 28, 4),

('Disponible', 'Vendida', '2025-06-30 10:10:00', 'Compra de contado realizada.', 29, 5),

('Disponible', 'Reservada', '2025-07-18 13:20:00', 'Interés manifestado por comprador frecuente.', 30, 6),
('Reservada', 'Vendida', '2025-08-05 15:40:00', 'Cliente firmó y registró propiedad.', 30, 7),

('Disponible', 'Reservada', '2025-08-25 16:10:00', 'Reserva en proceso por inversionista.', 31, 8),
('Reservada', 'Disponible', '2025-09-03 09:00:00', 'Se canceló negociación por temas financieros.', 31, 9);

INSERT INTO historial_estado_propiedad
(estado_anterior, estado_nuevo, fecha_cambio, justificacion, id_propiedad, id_usuario)
VALUES
('Disponible', 'Reservada', '2025-07-01 10:00:00', 'Cliente interesado, en proceso de separación.', 1, 1),
('Reservada', 'Vendida', '2025-08-01 15:30:00', 'Compra finalizada y escrituras firmadas.', 1, 2),

('Disponible', 'Reservada', '2025-06-15 09:45:00', 'Reservada por cliente con crédito aprobado.', 2, 3),
('Reservada', 'Vendida', '2025-07-10 13:00:00', 'Venta concretada con pago total.', 2, 4),

('Disponible', 'Vendida', '2025-07-05 11:00:00', 'Venta rápida por oferta directa.', 3, 5),

('Disponible', 'Reservada', '2025-07-20 14:20:00', 'Negociación avanzada, a espera de firma.', 4, 6),
('Reservada', 'Disponible', '2025-08-01 16:00:00', 'Cliente se retiró antes de firmar contrato.', 4, 7),

('Disponible', 'Reservada', '2025-06-10 10:30:00', 'Cliente extranjero solicitó reserva.', 5, 8),

('Reservada', 'Vendida', '2025-07-01 17:00:00', 'Trámite de escrituración completado.', 5, 9),

('Disponible', 'Reservada', '2025-05-01 12:00:00', 'Proceso de compra iniciado.', 6, 10),

('Disponible', 'Reservada', '2025-08-15 09:15:00', 'Cliente interesado dejó depósito.', 7, 1),
('Reservada', 'Vendida', '2025-09-01 11:30:00', 'Venta finalizada tras aprobación de crédito.', 7, 2),

('Disponible', 'Reservada', '2025-07-25 08:30:00', 'Cliente en etapa de análisis financiero.', 8, 3),
('Reservada', 'Disponible', '2025-08-10 14:45:00', 'Cliente canceló su interés.', 8, 4),

('Disponible', 'Vendida', '2025-06-30 10:10:00', 'Compra de contado realizada.', 9, 5),

('Disponible', 'Reservada', '2025-07-18 13:20:00', 'Interés manifestado por comprador frecuente.', 10, 6),
('Reservada', 'Vendida', '2025-08-05 15:40:00', 'Cliente firmó y registró propiedad.', 10, 7),

('Disponible', 'Reservada', '2025-08-25 16:10:00', 'Reserva en proceso por inversionista.', 11, 8),
('Reservada', 'Disponible', '2025-09-03 09:00:00', 'Se canceló negociación por temas financieros.', 11, 9);

-- CONTRATOS FINALIZADOS
INSERT INTO contrato
(fecha_contrato, valor_venta, fecha_venta, archivo_pdf, id_propiedad, id_cliente, id_usuario, estado_contrato)
VALUES
('2025-07-25', 450000000.00, '2025-08-01', 'contrato_21.pdf', 21, 1, 12, 'Finalizado'),
('2025-06-20', 850000000.00, '2025-07-10', 'contrato_22.pdf', 22, 2, 14, 'Finalizado'),
('2025-06-25', 600000000.00, '2025-07-05', 'contrato_23.pdf', 23, 3, 15, 'Finalizado'),
('2025-06-28', 150000000.00, '2025-07-01', 'contrato_25.pdf', 25, 5, 19, 'Finalizado'),
('2025-06-15', 550000000.00, '2025-06-30', 'contrato_29.pdf', 29, 9, 15, 'Finalizado'),
('2025-07-28', 480000000.00, '2025-08-05', 'contrato_30.pdf', 30, 10, 17, 'Finalizado');


