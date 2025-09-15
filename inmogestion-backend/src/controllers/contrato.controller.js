import db from "../config/db.js"; // Conexión a la base de datos

//  Obtener todos los contratos con información relacionada (cliente, propiedad, usuario)
export const getContratos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, cl.nombre_cliente, cl.apellido_cliente, p.tipo_propiedad, u.nombre AS agente
      FROM contrato c
      JOIN cliente cl ON c.id_cliente = cl.id_cliente
      JOIN propiedad p ON c.id_propiedad = p.id_propiedad
      JOIN usuario u ON c.id_usuario = u.id_usuario
    `);
    res.json(rows); // Devuelve todos los contratos con datos enriquecidos
  } catch (error) {
    res.status(500).json({ message: "Error al obtener contratos", error });
  }
};

//  Obtener un contrato específico por su ID
export const getContratoById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM contrato WHERE id_contrato = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Contrato no encontrado" });
    }

    res.json(rows[0]); // Devuelve el contrato encontrado
  } catch (error) {
    res.status(500).json({ message: "Error al obtener contrato", error });
  }
};

// Crear contrato con validaciones
export const createContrato = async (req, res) => {
  try {
    const { fecha_contrato, valor_venta, fecha_venta, archivo_pdf, id_propiedad, id_cliente, id_usuario } = req.body;

    // Validaciones básicas
    if (!fecha_contrato || !valor_venta || !id_propiedad || !id_cliente || !id_usuario) {
      return res.status(400).json({ message: "Todos los campos obligatorios deben estar completos" });
    }

    if (valor_venta <= 0) {
      return res.status(400).json({ message: "El valor de venta debe ser mayor a 0" });
    }

    // Verificar existencia de propiedad
    const [propiedad] = await db.query("SELECT * FROM propiedad WHERE id_propiedad = ?", [id_propiedad]);
    if (propiedad.length === 0) {
      return res.status(404).json({ message: "La propiedad no existe" });
    }

    // Verificar existencia de cliente
    const [cliente] = await db.query("SELECT * FROM cliente WHERE id_cliente = ?", [id_cliente]);
    if (cliente.length === 0) {
      return res.status(404).json({ message: "El cliente no existe" });
    }

    // Verificar existencia de usuario (agente/admin)
    const [usuario] = await db.query("SELECT * FROM usuario WHERE id_usuario = ?", [id_usuario]);
    if (usuario.length === 0) {
      return res.status(404).json({ message: "El usuario no existe" });
    }

    // Insertar contrato
    const [result] = await db.query(
      `INSERT INTO contrato 
        (fecha_contrato, valor_venta, fecha_venta, archivo_pdf, id_propiedad, id_cliente, id_usuario) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [fecha_contrato, valor_venta, fecha_venta || null, archivo_pdf || null, id_propiedad, id_cliente, id_usuario]
    );

    res.status(201).json({
      message: "Contrato creado exitosamente",
      contratoId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear contrato", error });
  }
};

//  Actualizar un contrato existente
export const updateContrato = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fecha_contrato,
      valor_venta,
      fecha_venta,
      archivo_pdf,
      id_propiedad,
      id_cliente,
      id_usuario,
      estado_contrato
    } = req.body;

    await db.query(
      `UPDATE contrato 
       SET fecha_contrato=?, valor_venta=?, fecha_venta=?, archivo_pdf=?, id_propiedad=?, id_cliente=?, id_usuario=?, estado_contrato=?
       WHERE id_contrato=?`,
      [fecha_contrato, valor_venta, fecha_venta, archivo_pdf, id_propiedad, id_cliente, id_usuario, estado_contrato, id]
    );

    res.json({ message: "Contrato actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar contrato", error });
  }
};

//  Eliminar un contrato por su ID
export const deleteContrato = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM contrato WHERE id_contrato=?", [id]);

    res.json({ message: "Contrato eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar contrato", error });
  }
};

//  Obtener todos los contratos de un cliente específico
export const getContratosByCliente = async (req, res) => {
  try {
    const { idCliente } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM contrato WHERE id_cliente = ?`,
      [idCliente]
    );

    res.json(rows); // Devuelve todos los contratos del cliente
  } catch (error) {
    res.status(500).json({ message: "Error al obtener contratos por cliente", error });
  }
};

//  Obtener todos los contratos de una propiedad específica
export const getContratosByPropiedad = async (req, res) => {
  try {
    const { idPropiedad } = req.params;

    const [rows] = await db.query(
      `SELECT * FROM contrato WHERE id_propiedad = ?`,
      [idPropiedad]
    );

    res.json(rows); // Devuelve todos los contratos relacionados a una propiedad
  } catch (error) {
    res.status(500).json({ message: "Error al obtener contratos por propiedad", error });
  }
};
