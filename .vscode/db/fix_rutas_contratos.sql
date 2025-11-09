-- Limpiar el "/" inicial de las rutas de contratos
-- Este script corrige las rutas que empiezan con "/" para que sean relativas

-- Desactivar modo seguro temporalmente
SET SQL_SAFE_UPDATES = 0;

UPDATE contrato_documento 
SET archivo_pdf = SUBSTRING(archivo_pdf, 2)
WHERE archivo_pdf LIKE '/%';

-- Reactivar modo seguro
SET SQL_SAFE_UPDATES = 1;

-- Verificar los cambios
SELECT 
    id_contrato_documento,
    archivo_pdf,
    estado_documento,
    fecha_generacion
FROM contrato_documento
ORDER BY id_contrato_documento;
