import db from "../config/db.js"; // Importa la configuración y conexión a la base de datos

// Función para obtener un usuario activo por su correo electrónico
export const getUsuarioPorCorreo = async (correo) => {
  // Ejecuta una consulta SQL usando prepared statements para evitar inyección SQL
  // Selecciona todos los campos (*) de la tabla 'usuario' donde el correo coincida y el estado sea 'Activo'
  const [rows] = await db.execute(
    "SELECT * FROM usuario WHERE correo = ? AND estado = 'Activo'",
    [correo] // El parámetro reemplaza el signo de interrogación (?) en la consulta
  );
  
  // Devuelve el primer resultado (si existe) o undefined si no se encontró
  return rows[0];
};
