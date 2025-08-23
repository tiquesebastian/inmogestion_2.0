// Importación de los métodos del modelo de cliente
import {
    getClientes,
    createCliente,
    getClienteById,
    updateCliente,
    deleteCliente,
} from "../models/cliente.model.js";

// Controlador para obtener todos los clientes
// Obtener todos los clientes
export const obtenerClientes = async (req, res) => {
try {
    const clientes = await getClientes();
    res.json(clientes);
} catch (error) {
    res.status(500).json({ message: "Error al obtener clientes", error });
}
};

// Controlador para crear un nuevo cliente
// Crear cliente
export const agregarCliente = async (req, res) => {
try {
    const id = await createCliente(req.body);
    res.status(201).json({ message: "Cliente creado con éxito", id });
} catch (error) {
    res.status(500).json({ message: "Error al crear cliente", error });
}
};

// Controlador para obtener un cliente por su ID
// Obtener cliente por ID
export const obtenerClientePorId = async (req, res) => {
try {
    const cliente = await getClienteById(req.params.id);
    if (!cliente) {
    return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(cliente);
} catch (error) {
    res.status(500).json({ message: "Error al obtener cliente", error });
}
};

// Controlador para actualizar los datos de un cliente
// Actualizar cliente
export const actualizarCliente = async (req, res) => {
try {
    const result = await updateCliente(req.params.id, req.body);
    if (result === 0) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json({ message: "Cliente actualizado con éxito" });
} catch (error) {
    res.status(500).json({ message: "Error al actualizar cliente", error });
}
};

// Controlador para eliminar un cliente
// Eliminar cliente
export const eliminarCliente = async (req, res) => {
try {
    const result = await deleteCliente(req.params.id);
    if (result === 0) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json({ message: "Cliente eliminado con éxito" });
} catch (error) {
    res.status(500).json({ message: "Error al eliminar cliente", error });
}
};
