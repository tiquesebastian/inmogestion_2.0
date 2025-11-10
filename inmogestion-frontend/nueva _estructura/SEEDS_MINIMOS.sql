-- Datos mínimos para probar InmoGestión (después de ejecutar BASE_DATOS_COMPLETA.sql)
USE inmogestion;

-- Usuario Administrador (password: Admin123!)
-- Hash generado con bcrypt (cost 10). Si cambias, rehash.
INSERT INTO usuario (nombre, apellido, correo, telefono, nombre_usuario, contrasena, id_rol)
VALUES ('Super', 'Admin', 'admin@inmogestion.local', '3000000000', 'admin', '$2b$10$F4rFJ4H9tXvZ9qCV6sP2EOVMlNqPi4Ewz0hLKi65u9BTsN/NTmRba', 1)
ON DUPLICATE KEY UPDATE correo=VALUES(correo);

-- Usuario Agente (password: Agente123!)
INSERT INTO usuario (nombre, apellido, correo, telefono, nombre_usuario, contrasena, id_rol)
VALUES ('Ana', 'Agente', 'agente@inmogestion.local', '3011111111', 'agente', '$2b$10$inG4Z0Oq2XaLK3yJkVMoFerLeFh4dbGmI5O8UG12YDU/BY90QqgU2', 2)
ON DUPLICATE KEY UPDATE correo=VALUES(correo);

-- Localidad y barrio de ejemplo
INSERT INTO localidad (nombre_localidad) VALUES ('Chapinero') ON DUPLICATE KEY UPDATE nombre_localidad=VALUES(nombre_localidad);
INSERT INTO barrio (nombre_barrio, codigo_postal, id_localidad)
SELECT 'Zona Centro', '110111', id_localidad FROM localidad WHERE nombre_localidad='Chapinero'
LIMIT 1;

-- Cliente (password: Cliente123!)
INSERT INTO cliente (nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente, nombre_usuario, contrasena)
VALUES ('Juan', 'Cliente', '100000001', 'cliente@inmogestion.local', '3022222222', 'cliente', '$2b$10$QbnDqjE8JfLOJ.R5YucsV.0k9Vc0qhzoVcdxYo7LZI1noU7fa28jK')
ON DUPLICATE KEY UPDATE correo_cliente=VALUES(correo_cliente);

-- Propiedad de ejemplo (asignada al agente)
INSERT INTO propiedad (tipo_propiedad, direccion_formato, precio_propiedad, area_m2, num_habitaciones, num_banos, descripcion, id_barrio, id_usuario)
SELECT 'Apartamento', 'Calle 123 # 45-67', 350000000, 82.5, 3, 2, 'Apartamento moderno en zona central', b.id_barrio, u.id_usuario
FROM barrio b
JOIN usuario u ON u.nombre_usuario='agente'
LIMIT 1;

-- Interés simulado
INSERT INTO interes_propiedad (id_propiedad, nombre_cliente, correo_cliente, telefono_cliente, mensaje, estado)
SELECT p.id_propiedad, 'Carlos Pérez', 'carlos@example.com', '3009999999', 'Estoy interesado en la propiedad', 'Pendiente'
FROM propiedad p
LIMIT 1;

-- Visita simulada
INSERT INTO visita (id_propiedad, id_cliente, id_agente, fecha_visita, hora_visita, notas)
SELECT p.id_propiedad, c.id_cliente, u.id_usuario, DATE_ADD(NOW(), INTERVAL 3 DAY), '10:00', 'Visita inicial'
FROM propiedad p
JOIN cliente c ON c.nombre_usuario='cliente'
JOIN usuario u ON u.nombre_usuario='agente'
LIMIT 1;

-- Confirmar
SELECT 'SEEDS MINIMOS INSERTADOS' AS status;
