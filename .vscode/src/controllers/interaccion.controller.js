// 📦 Importamos la configuración de conexión a la base de datos
import db from "../config/db.js";

//
// ✅ 1. Obtener todas las interacciones
//
export const getInteracciones = async (req, res) => {
  try {
    // 🔍 Consultamos todas las filas de la tabla interaccion_cliente
    const [rows] = await db.query("SELECT * FROM interaccion_cliente");

    // 📤 Enviamos los resultados como JSON
    res.json(rows);
  } catch (error) {
    // ❌ Si ocurre un error, lo mostramos y devolvemos código 500
    res.status(500).json({ message: "Error al obtener interacciones", error });
  }
};

//
// ✅ 2. Crear una nueva interacción
//
export const createInteraccion = async (req, res) => {
  try {
    // 📥 Extraemos los datos del cuerpo de la solicitud
    const { id_cliente, id_usuario, tipo_interaccion, notas } = req.body;

    // 🛑 Validamos que los campos obligatorios estén presentes
    if (!id_cliente || !id_usuario || !tipo_interaccion) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // 📝 Insertamos la nueva interacción en la base de datos
    const [result] = await db.query(
      `INSERT INTO interaccion_cliente 
       (id_cliente, id_usuario, tipo_interaccion, notas) 
       VALUES (?, ?, ?, ?)`,
      [id_cliente, id_usuario, tipo_interaccion, notas || null] // notas puede ser null
    );

    // 📤 Respondemos con éxito y el ID insertado
    res.status(201).json({
      message: "Interacción registrada exitosamente",
      interaccionId: result.insertId,
    });
  } catch (error) {
    // ❌ Si ocurre un error en la base de datos
    res.status(500).json({ message: "Error al crear interacción", error });
  }
};

//
// ✅ 3. Eliminar una interacción por ID
//
export const deleteInteraccion = async (req, res) => {
  try {
    // 📥 Obtenemos el ID desde la URL
    const { id } = req.params;

    // 🗑️ Ejecutamos la eliminación en la base de datos
    await db.query("DELETE FROM interaccion_cliente WHERE id_interaccion = ?", [id]);

    // 📤 Confirmamos la eliminación
    res.json({ message: "Interacción eliminada exitosamente" });
  } catch (error) {
    // ❌ Si ocurre un error
    res.status(500).json({ message: "Error al eliminar interacción", error });
  }
};
