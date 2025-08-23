import pool from "../config/db.js";


// Obtener todos los clientes
export const getClientes = async () => {
  const [rows] = await pool.query("SELECT * FROM cliente");
return rows;
};

// Crear un cliente nuevo
export const createCliente = async (data) => {
const { nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente } = data;

const [result] = await pool.query(
    `INSERT INTO cliente (nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente)
    VALUES (?, ?, ?, ?, ?)`,
    [nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente]
);

return result.insertId;
};

// Buscar cliente por ID
export const getClienteById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM cliente WHERE id_cliente = ?", [id]);
return rows[0];
};

// Actualizar cliente
export const updateCliente = async (id, data) => {
const { nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente, estado_cliente } = data;
const [result] = await pool.query(
    `UPDATE cliente SET nombre_cliente=?, apellido_cliente=?, correo_cliente=?, telefono_cliente=?, estado_cliente=? WHERE id_cliente=?`,
    [nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente, estado_cliente, id]
);
return result.affectedRows;
};

// Eliminar cliente
export const deleteCliente = async (id) => {
const [result] = await pool.query("DELETE FROM cliente WHERE id_cliente = ?", [id]);
return result.affectedRows;
};
