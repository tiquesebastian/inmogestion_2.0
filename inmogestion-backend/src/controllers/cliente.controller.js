import db from "../config/db.js";
import nodemailer from 'nodemailer';

// Configurar el transporte de correo (usando un servicio como Gmail, SMTP, etc.)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes usar otro servicio como SMTP si prefieres
  auth: {
    user: 'tucorreo@gmail.com', // Tu correo de envío
    pass: 'tu_contraseña_de_aplicacion', // Tu contraseña de aplicación (si usas Gmail con 2FA)
  },
});

// Función para enviar correo de bienvenida
const sendWelcomeEmail = (email, nombre) => {
  const mailOptions = {
    from: 'tucorreo@gmail.com', // Correo de envío
    to: email, // Correo del cliente
    subject: 'Bienvenido a InmoGestion', // Asunto del correo
    text: `Hola ${nombre},\n\n¡Gracias por registrarte en InmoGestion! Estamos felices de tenerte con nosotros.\n\nSaludos,\nEl equipo de InmoGestion`, // Contenido del correo
  };

  // Enviar el correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("❌ Error al enviar correo de bienvenida:", error);
    } else {
      console.log("✅ Correo de bienvenida enviado: " + info.response);
    }
  });
};

// Obtener todos los clientes ordenados por id_cliente DESC
export const getClientes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cliente ORDER BY id_cliente DESC");
    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error al obtener clientes:", error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

// Obtener cliente por ID
export const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM cliente WHERE id_cliente = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener cliente:", error);
    res.status(500).json({ message: "Error al obtener cliente" });
  }
};

// Crear cliente con validaciones
export const createCliente = async (req, res) => {
  try {
    const { nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente } = req.body;

    // Validar campos obligatorios
    if (!nombre_cliente || !apellido_cliente || !documento_cliente || !correo_cliente) {
      return res.status(400).json({ message: "Todos los campos obligatorios deben estar completos" });
    }

    // Verificar duplicados (documento)
    const [[docExist]] = await db.query("SELECT 1 FROM cliente WHERE documento_cliente = ?", [documento_cliente]);
    if (docExist) {
      return res.status(409).json({ message: "El documento ya está registrado" });
    }

    // Verificar duplicados (correo)
    const [[correoExist]] = await db.query("SELECT 1 FROM cliente WHERE correo_cliente = ?", [correo_cliente]);
    if (correoExist) {
      return res.status(409).json({ message: "El correo ya está registrado" });
    }

    // Insertar cliente
    const [result] = await db.query(
      `INSERT INTO cliente 
      (nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente) 
      VALUES (?, ?, ?, ?, ?)`,
      [nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente || null]
    );

    // Enviar correo de bienvenida después de registrar al cliente
    sendWelcomeEmail(correo_cliente, nombre_cliente);

    res.status(201).json({
      message: "Cliente creado exitosamente",
      clienteId: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error al crear cliente:", error);
    res.status(500).json({ message: "Error al crear cliente" });
  }
};

// Actualizar cliente (validar que exista primero)
export const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente } = req.body;

    const [rows] = await db.query("SELECT * FROM cliente WHERE id_cliente = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    await db.query(
      `UPDATE cliente 
      SET nombre_cliente=?, apellido_cliente=?, documento_cliente=?, correo_cliente=?, telefono_cliente=? 
      WHERE id_cliente=?`,
      [nombre_cliente, apellido_cliente, documento_cliente, correo_cliente, telefono_cliente, id]
    );

    res.status(200).json({ message: "Cliente actualizado exitosamente" });
  } catch (error) {
    console.error("❌ Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error al actualizar cliente" });
  }
};

// Eliminar cliente
export const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM cliente WHERE id_cliente = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.status(200).json({ message: "Cliente eliminado exitosamente" });
  } catch (error) {
    console.error("❌ Error al eliminar cliente:", error);
    res.status(500).json({ message: "Error al eliminar cliente" });
  }
};
