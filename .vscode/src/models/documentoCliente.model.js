import db from '../config/db.js';

const DocumentoCliente = {
  // Crear documento
  async create(data) {
    const query = `
      INSERT INTO documento_cliente 
      (cliente_id, tipo_documento, nombre_archivo, ruta_archivo, descripcion, subido_por)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      data.cliente_id,
      data.tipo_documento,
      data.nombre_archivo,
      data.ruta_archivo,
      data.descripcion || null,
      data.subido_por
    ]);
    return result.insertId;
  },

  // Listar por cliente
  async getByCliente(clienteId) {
    const query = `
      SELECT 
        dc.*,
        u.nombre as subido_por_nombre,
        c.nombre_cliente as cliente_nombre
      FROM documento_cliente dc
      LEFT JOIN usuario u ON dc.subido_por = u.id_usuario
      LEFT JOIN cliente c ON dc.cliente_id = c.id_cliente
      WHERE dc.cliente_id = ?
      ORDER BY dc.fecha_subida DESC
    `;
    const [rows] = await db.execute(query, [clienteId]);
    return rows;
  },

  // Obtener por ID
  async getById(id) {
    const query = `
      SELECT 
        dc.*,
        c.nombre_cliente as cliente_nombre,
        c.correo_cliente as cliente_email
      FROM documento_cliente dc
      LEFT JOIN cliente c ON dc.cliente_id = c.id_cliente
      WHERE dc.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  },

  // Eliminar documento
  async delete(id) {
    const query = 'DELETE FROM documento_cliente WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  },

  // Listar todos (admin)
  async getAll() {
    const query = `
      SELECT 
        dc.*,
        c.nombre_cliente as cliente_nombre,
        c.correo_cliente as cliente_email,
        u.nombre as subido_por_nombre
      FROM documento_cliente dc
      LEFT JOIN cliente c ON dc.cliente_id = c.id_cliente
      LEFT JOIN usuario u ON dc.subido_por = u.id_usuario
      ORDER BY dc.fecha_subida DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
  }
};

export default DocumentoCliente;
