-- Agregar columna para controlar envío de recordatorios
ALTER TABLE visita 
ADD COLUMN recordatorio_enviado TINYINT(1) DEFAULT 0 COMMENT 'Indica si se envió el recordatorio por email';
