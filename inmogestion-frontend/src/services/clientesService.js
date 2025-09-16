import axios from "axios";

// URL base para el endpoint de clientes en el backend
const API_URL = "http://localhost:4000/api/clientes";

// 👉 Función para obtener todos los clientes
export const getClientes = async () => {
  // Obtenemos el token almacenado para la autenticación
  const token = localStorage.getItem("token");

  // Hacemos una petición GET con el token en los headers para autorización
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`, // Token en formato Bearer
    },
  });

  // Retornamos los datos recibidos del servidor (lista de clientes)
  return response.data;
};

// 👉 Función para crear un nuevo cliente
export const createCliente = async (cliente) => {
  const token = localStorage.getItem("token");

  // Petición POST enviando el objeto cliente y autorización con token
  const response = await axios.post(API_URL, cliente, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Retornamos la respuesta con el cliente creado o info relevante
  return response.data;
};

// 👉 Función para eliminar un cliente por su id
export const deleteCliente = async (id) => {
  const token = localStorage.getItem("token");

  // Petición DELETE con el id del cliente y token para autorización
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Retornamos la respuesta del backend tras la eliminación
  return response.data;
};
