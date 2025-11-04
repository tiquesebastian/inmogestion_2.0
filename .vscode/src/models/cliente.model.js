import { db } from "../config/db.js";

// Obtener todos los clientes
export const getAllClientes = async () => {
  const [rows] = await db.query("SELECT * FROM cliente");
  return rows;
};

// Crear un nuevo cliente
export const createCliente = async (cliente) => {
  const { nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente } = cliente;
  const [result] = await db.query(
    "INSERT INTO cliente (nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente) VALUES (?, ?, ?, ?, ?)",
    [nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente]
  );
  return { id: result.insertId, ...cliente };
};
