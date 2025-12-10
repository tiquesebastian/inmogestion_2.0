-- ============================================
-- MIGRACIÓN: Agregar columna detalle_json a auditoría
-- Fecha: 24 de noviembre de 2025
-- Descripción: Añade campo JSON para almacenar detalles estructurados de auditoría
-- ============================================

USE inmogestion;

-- Verificar si la columna ya existe
SET @dbname = DATABASE();
SET @tablename = 'auditoria';
SET @columnname = 'detalle_json';

SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT "✅ Columna detalle_json ya existe" AS status',
  'ALTER TABLE auditoria ADD COLUMN detalle_json JSON NULL AFTER descripcion'
));

PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Crear índices para búsquedas frecuentes
SET @index_tabla = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = @dbname
  AND TABLE_NAME = 'auditoria'
  AND INDEX_NAME = 'idx_tabla_accion'
);

SET @sql_index_tabla = IF(
  @index_tabla > 0,
  'SELECT "✅ Índice idx_tabla_accion ya existe" AS status',
  'CREATE INDEX idx_tabla_accion ON auditoria(tabla_afectada, accion)'
);

PREPARE stmt FROM @sql_index_tabla;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Índice por fecha para queries temporales
SET @index_fecha = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = @dbname
  AND TABLE_NAME = 'auditoria'
  AND INDEX_NAME = 'idx_fecha_accion'
);

SET @sql_index_fecha = IF(
  @index_fecha > 0,
  'SELECT "✅ Índice idx_fecha_accion ya existe" AS status',
  'CREATE INDEX idx_fecha_accion ON auditoria(fecha_accion DESC)'
);

PREPARE stmt FROM @sql_index_fecha;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Índice por usuario para auditoría por persona
SET @index_usuario = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = @dbname
  AND TABLE_NAME = 'auditoria'
  AND INDEX_NAME = 'idx_usuario_accion'
);

SET @sql_index_usuario = IF(
  @index_usuario > 0,
  'SELECT "✅ Índice idx_usuario_accion ya existe" AS status',
  'CREATE INDEX idx_usuario_accion ON auditoria(usuario_accion)'
);

PREPARE stmt FROM @sql_index_usuario;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificación final
SELECT '✅ Migración de auditoría completada' AS STATUS;

SELECT 
  COLUMN_NAME AS columna,
  COLUMN_TYPE AS tipo,
  IS_NULLABLE AS nullable,
  COLUMN_DEFAULT AS default_value
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'inmogestion'
AND TABLE_NAME = 'auditoria'
ORDER BY ORDINAL_POSITION;

SELECT 
  INDEX_NAME AS indice,
  COLUMN_NAME AS columna,
  SEQ_IN_INDEX AS orden
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'inmogestion'
AND TABLE_NAME = 'auditoria'
AND INDEX_NAME != 'PRIMARY'
ORDER BY INDEX_NAME, SEQ_IN_INDEX;

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================
