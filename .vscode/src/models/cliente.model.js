import db from "../config/db.js";

// Obtener todos los clientes
export const getAllClientes = async () => {
  const [rows] = await db.query("SELECT * FROM cliente");
  return rows;
};

// Crear un nuevo cliente
export const createCliente = async (cliente) => {
  const {
    nombre_cliente,
    apellido_cliente,
    documento_cliente,
    correo_cliente,
    telefono_cliente,
    nombre_usuario = null,
    contrasena = null,
    reset_token = null,
    reset_token_expires = null,
  } = cliente;

  const [result] = await db.query(
    `INSERT INTO cliente (
      nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente,
      nombre_usuario, contrasena, reset_token, reset_token_expires
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre_cliente,
      apellido_cliente,
      documento_cliente,
      correo_cliente,
      telefono_cliente,
      nombre_usuario,
      contrasena,
      reset_token,
      reset_token_expires,
    ]
  );
  return { id: result.insertId, ...cliente };
};
