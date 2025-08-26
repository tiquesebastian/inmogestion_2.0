import db from "../config/db.js";

// Obtener todos los clientes
export const getClientes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cliente");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener clientes:", error);
    res.status(500).json({ message: "Error al obtener clientes", error });
  }
};

// Crear cliente
export const createCliente = async (req, res) => {
  try {
    const { nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente } = req.body;

    if (!nombre_cliente || !apellido_cliente || !documento_cliente) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(
      "INSERT INTO cliente (nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente) VALUES (?, ?, ?, ?, ?)",
      [nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente]
    );

    res.status(201).json({
      message: "Cliente creado exitosamente",
      clienteId: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error al crear cliente:", error);
    res.status(500).json({ message: "Error al crear cliente", error });
  }
};

// Actualizar cliente
export const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente } = req.body;

    await db.query(
      "UPDATE cliente SET nombre_cliente=?, apellido_cliente=?, documento_cliente=?, correo_cliente=?, telefono_cliente=? WHERE id_cliente=?",
      [nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente, id]
    );

    res.json({ message: "Cliente actualizado exitosamente" });
  } catch (error) {
    console.error("❌ Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error al actualizar cliente", error });
  }
};

// Eliminar cliente
export const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM cliente WHERE id_cliente=?", [id]);

    res.json({ message: "Cliente eliminado exitosamente" });
  } catch (error) {
    console.error("❌ Error al eliminar cliente:", error);
    res.status(500).json({ message: "Error al eliminar cliente", error });
  }
};
