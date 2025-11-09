-- Agregar columnas para recuperación de contraseña en tabla usuario
ALTER TABLE usuario 
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN reset_token_expires DATETIME NULL;
