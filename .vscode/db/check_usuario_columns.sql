-- Verificar si las columnas de reset ya existen en la tabla usuario
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'inmogestion' 
  AND TABLE_NAME = 'usuario'
  AND COLUMN_NAME IN ('reset_token', 'reset_token_expires');
