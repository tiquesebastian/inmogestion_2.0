import axios from "axios";

const API_URL = "http://localhost:4000/api/clientes";

// 👉 obtener todos los clientes
export const getClientes = async () => {
  const token = localStorage.getItem("token"); // si usas token
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 👉 crear un cliente
export const createCliente = async (cliente) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_URL, cliente, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// 👉 eliminar cliente
export const deleteCliente = async (id) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
