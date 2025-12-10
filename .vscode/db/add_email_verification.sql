-- ============================================
-- MIGRACIÓN: Verificación de Email
-- Fecha: 24 de noviembre de 2025
-- Descripción: Agregar campos para verificación de email en usuario y cliente
-- ============================================

USE inmogestion;

-- ============================================
-- 1. TABLA USUARIO - Agregar campos de verificación
-- ============================================

-- Verificar si las columnas ya existen antes de agregarlas
SET @dbname = DATABASE();
SET @tablename = 'usuario';
SET @columnname1 = 'email_verificado';
SET @columnname2 = 'email_token';
SET @columnname3 = 'email_token_expires';

-- Agregar email_verificado si no existe
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname1)
  ) > 0,
  'SELECT 1',
  'ALTER TABLE usuario ADD COLUMN email_verificado TINYINT(1) DEFAULT 0 AFTER estado'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Agregar email_token si no existe
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname2)
  ) > 0,
  'SELECT 1',
  'ALTER TABLE usuario ADD COLUMN email_token VARCHAR(64) NULL AFTER email_verificado'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Agregar email_token_expires si no existe
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname3)
  ) > 0,
  'SELECT 1',
  'ALTER TABLE usuario ADD COLUMN email_token_expires DATETIME NULL AFTER email_token'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- ============================================
-- 2. TABLA CLIENTE - Agregar campos de verificación
-- ============================================

SET @tablename = 'cliente';
SET @columnname1 = 'email_verificado';
SET @columnname2 = 'email_token';
SET @columnname3 = 'email_token_expires';

-- Agregar email_verificado si no existe
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname1)
  ) > 0,
  'SELECT 1',
  'ALTER TABLE cliente ADD COLUMN email_verificado TINYINT(1) DEFAULT 0 AFTER estado_cliente'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Agregar email_token si no existe
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname2)
  ) > 0,
  'SELECT 1',
  'ALTER TABLE cliente ADD COLUMN email_token VARCHAR(64) NULL AFTER email_verificado'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Agregar email_token_expires si no existe
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname3)
  ) > 0,
  'SELECT 1',
  'ALTER TABLE cliente ADD COLUMN email_token_expires DATETIME NULL AFTER email_token'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- ============================================
-- 3. ÍNDICES para optimización de búsquedas
-- ============================================

-- Índice para búsqueda rápida de tokens en usuario
SET @index_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = @dbname
  AND TABLE_NAME = 'usuario'
  AND INDEX_NAME = 'idx_email_token_usuario'
);

SET @sql_create_index = IF(
  @index_exists > 0,
  'SELECT 1',
  'CREATE INDEX idx_email_token_usuario ON usuario(email_token)'
);

PREPARE stmt FROM @sql_create_index;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Índice para búsqueda rápida de tokens en cliente
SET @index_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = @dbname
  AND TABLE_NAME = 'cliente'
  AND INDEX_NAME = 'idx_email_token_cliente'
);

SET @sql_create_index = IF(
  @index_exists > 0,
  'SELECT 1',
  'CREATE INDEX idx_email_token_cliente ON cliente(email_token)'
);

PREPARE stmt FROM @sql_create_index;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- 4. VERIFICACIÓN de cambios
-- ============================================

SELECT '✅ Migraciones aplicadas exitosamente' AS STATUS;

SELECT 
  'usuario' AS tabla,
  COLUMN_NAME AS columna,
  COLUMN_TYPE AS tipo,
  COLUMN_DEFAULT AS valor_default
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'inmogestion'
AND TABLE_NAME = 'usuario'
AND COLUMN_NAME IN ('email_verificado', 'email_token', 'email_token_expires');

SELECT 
  'cliente' AS tabla,
  COLUMN_NAME AS columna,
  COLUMN_TYPE AS tipo,
  COLUMN_DEFAULT AS valor_default
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'inmogestion'
AND TABLE_NAME = 'cliente'
AND COLUMN_NAME IN ('email_verificado', 'email_token', 'email_token_expires');

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================
