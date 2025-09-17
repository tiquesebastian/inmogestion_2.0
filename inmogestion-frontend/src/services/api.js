// src/services/api.js

const API_URL = import.meta.env.VITE_API_URL;

// ==== Subir archivo (Carga Masiva) ====
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al subir archivo");
  return res.json();
}

// ==== Ejemplo: consumir saludo ====
export async function getSaludo() {
  const res = await fetch(`${API_URL}/saludo`);
  if (!res.ok) throw new Error("Error al obtener saludo");
  return res.json();
}
