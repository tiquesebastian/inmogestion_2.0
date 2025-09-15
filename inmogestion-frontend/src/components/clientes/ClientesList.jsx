// src/components/clientes/ClientesList.jsx
import { useEffect, useState } from "react";
import { getClientes, deleteCliente, createCliente } from "../../services/clientesService";
import { TrashIcon } from "@heroicons/react/24/solid";
import ClienteForm from "./ClienteForm";

function ClientesList() {
  const [clientes, setClientes] = useState([]);

  // 🔹 Cargar clientes al montar el componente
  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error("❌ Error al obtener clientes:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este cliente?")) {
      try {
        await deleteCliente(id);
        fetchClientes(); // recarga la lista
      } catch (error) {
        console.error("❌ Error al eliminar cliente:", error);
      }
    }
  };

  const handleAddCliente = async (nuevoCliente) => {
    try {
      await createCliente(nuevoCliente);
      fetchClientes(); // recarga la lista después de agregar
    } catch (error) {
      console.error("❌ Error al crear cliente:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Lista de Clientes</h1>

      {/* Formulario para agregar */}
      <ClienteForm onAdd={handleAddCliente} />

      {/* Tabla de clientes */}
      <table className="w-full border mt-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Nombre</th>
            <th className="p-2">Apellido</th>
            <th className="p-2">Documento</th>
            <th className="p-2">Correo</th>
            <th className="p-2">Teléfono</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id_cliente} className="border-b">
              <td className="p-2">{cliente.nombre_cliente}</td>
              <td className="p-2">{cliente.apellido_cliente}</td>
              <td className="p-2">{cliente.documento_cliente}</td>
              <td className="p-2">{cliente.correo_cliente}</td>
              <td className="p-2">{cliente.telefono_cliente}</td>
              <td className="p-2 text-center">
                <button
                  onClick={() => handleDelete(cliente.id_cliente)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                >
                  <TrashIcon className="h-5 w-5" />
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientesList;
