import db from "../config/db.js";

/**
 * Crear un nuevo contrato documento
 */
export const createContratoDocumento = async (contratoData) => {
  const {
    id_contrato = null,
    id_propiedad,
    id_cliente,
    tipo_inmueble,
    vendedor_nombre,
    vendedor_apellido,
    vendedor_tipo_documento,
    vendedor_numero_documento,
    vendedor_direccion = null,
    vendedor_telefono = null,
    comprador_nombre,
    comprador_apellido,
    comprador_tipo_documento,
    comprador_numero_documento,
    comprador_direccion = null,
    comprador_telefono = null,
    inmueble_matricula = null,
    inmueble_area_m2 = null,
    inmueble_direccion,
    inmueble_linderos = null,
    inmueble_descripcion = null,
    precio_venta,
    forma_pago,
    clausulas_adicionales = null,
    lugar_firma = 'Bogotá D.C.',
    fecha_firma,
    archivo_pdf = null,
    generado_por
  } = contratoData;

  const [result] = await db.query(
    `INSERT INTO contrato_documento (
      id_contrato, id_propiedad, id_cliente, tipo_inmueble,
      vendedor_nombre, vendedor_apellido, vendedor_tipo_documento, vendedor_numero_documento,
      vendedor_direccion, vendedor_telefono,
      comprador_nombre, comprador_apellido, comprador_tipo_documento, comprador_numero_documento,
      comprador_direccion, comprador_telefono,
      inmueble_matricula, inmueble_area_m2, inmueble_direccion, inmueble_linderos, inmueble_descripcion,
      precio_venta, forma_pago, clausulas_adicionales,
      lugar_firma, fecha_firma, archivo_pdf, generado_por
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id_contrato, id_propiedad, id_cliente, tipo_inmueble,
      vendedor_nombre, vendedor_apellido, vendedor_tipo_documento, vendedor_numero_documento,
      vendedor_direccion, vendedor_telefono,
      comprador_nombre, comprador_apellido, comprador_tipo_documento, comprador_numero_documento,
      comprador_direccion, comprador_telefono,
      inmueble_matricula, inmueble_area_m2, inmueble_direccion, inmueble_linderos, inmueble_descripcion,
      precio_venta, forma_pago, clausulas_adicionales,
      lugar_firma, fecha_firma, archivo_pdf, generado_por
    ]
  );

  return result.insertId;
};

/**
 * Obtener contrato documento por ID
 */
export const getContratoDocumentoById = async (id) => {
  const [rows] = await db.query(
    `SELECT 
      cd.*,
      u.nombre as generado_por_nombre,
      u.apellido as generado_por_apellido,
      c.nombre_cliente,
      c.correo_cliente,
      p.tipo_propiedad,
      p.direccion_formato as propiedad_direccion
    FROM contrato_documento cd
    LEFT JOIN usuario u ON cd.generado_por = u.id_usuario
    LEFT JOIN cliente c ON cd.id_cliente = c.id_cliente
    LEFT JOIN propiedad p ON cd.id_propiedad = p.id_propiedad
    WHERE cd.id_contrato_documento = ?`,
    [id]
  );
  return rows[0] || null;
};

/**
 * Obtener todos los contratos de un cliente
 */
export const getContratosByCliente = async (id_cliente) => {
  const [rows] = await db.query(
    `SELECT 
      cd.*,
      u.nombre as generado_por_nombre,
      u.apellido as generado_por_apellido,
      p.tipo_propiedad,
      p.direccion_formato as propiedad_direccion
    FROM contrato_documento cd
    LEFT JOIN usuario u ON cd.generado_por = u.id_usuario
    LEFT JOIN propiedad p ON cd.id_propiedad = p.id_propiedad
    WHERE cd.id_cliente = ?
    ORDER BY cd.fecha_generacion DESC`,
    [id_cliente]
  );
  return rows;
};

/**
 * Obtener todos los contratos (admin/agente)
 */
export const getAllContratosDocumentos = async () => {
  const [rows] = await db.query(
    `SELECT 
      cd.*,
      u.nombre as generado_por_nombre,
      u.apellido as generado_por_apellido,
      c.nombre_cliente,
      c.correo_cliente,
      p.tipo_propiedad,
      p.direccion_formato as propiedad_direccion
    FROM contrato_documento cd
    LEFT JOIN usuario u ON cd.generado_por = u.id_usuario
    LEFT JOIN cliente c ON cd.id_cliente = c.id_cliente
    LEFT JOIN propiedad p ON cd.id_propiedad = p.id_propiedad
    ORDER BY cd.fecha_generacion DESC`
  );
  return rows;
};

/**
 * Actualizar ruta del archivo PDF generado
 */
export const updateArchivoPdf = async (id, archivo_pdf) => {
  await db.query(
    `UPDATE contrato_documento SET archivo_pdf = ? WHERE id_contrato_documento = ?`,
    [archivo_pdf, id]
  );
};

/**
 * Actualizar estado del documento
 */
export const updateEstadoDocumento = async (id, estado) => {
  await db.query(
    `UPDATE contrato_documento SET estado_documento = ? WHERE id_contrato_documento = ?`,
    [estado, id]
  );
};
