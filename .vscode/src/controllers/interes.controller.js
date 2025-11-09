import { createInteres, getInteresesByPropiedad } from "../models/interes.model.js";
import db from "../config/db.js";
import { enviarEmailNuevoInteres } from '../services/email.service.js';

export const registrarInteres = async (req, res) => {
  try {
    const id_propiedad = parseInt(req.params.id, 10);
    if (isNaN(id_propiedad)) return res.status(400).json({ message: "ID de propiedad inválido" });

    const { id_cliente, nombre_cliente, correo_cliente, telefono_cliente, mensaje, preferencias } = req.body;

    // Verificar que la propiedad exista
    const [propRows] = await db.query("SELECT id_propiedad FROM propiedad WHERE id_propiedad = ?", [id_propiedad]);
    if (propRows.length === 0) return res.status(404).json({ message: "Propiedad no encontrada" });

    // Insertar interés
    const insertId = await createInteres({
      id_propiedad,
      id_cliente,
      nombre_cliente,
      correo_cliente,
      telefono_cliente,
      mensaje,
      preferencias,
    });

    // Obtener datos de la propiedad y agente para el email
    const [propiedadData] = await db.query(`
      SELECT 
        p.direccion_formato, 
        p.tipo_propiedad, 
        p.precio_propiedad,
        u.nombre as agente_nombre,
        u.correo as agente_email
      FROM propiedad p
      LEFT JOIN usuario u ON p.id_usuario = u.id_usuario
      WHERE p.id_propiedad = ?
    `, [id_propiedad]);

    // Enviar email al agente (asíncrono)
    if (propiedadData.length > 0 && propiedadData[0].agente_email) {
      const emailData = {
        agente_nombre: propiedadData[0].agente_nombre,
        agente_email: propiedadData[0].agente_email,
        cliente_nombre: nombre_cliente,
        cliente_email: correo_cliente,
        cliente_telefono: telefono_cliente,
        propiedad_direccion: propiedadData[0].direccion_formato,
        propiedad_tipo: propiedadData[0].tipo_propiedad,
        propiedad_precio: propiedadData[0].precio_propiedad,
        comentarios: mensaje
      };

      enviarEmailNuevoInteres(emailData)
        .then(() => console.log('📧 Email de interés enviado al agente'))
        .catch(err => console.error('❌ Error al enviar email:', err));
    }

    // Responder
    res.status(201).json({ ok: true, id_interes: insertId });
  } catch (error) {
    console.error("Error registrarInteres:", error);
    res.status(500).json({ message: "Error al registrar interés", error });
  }
};

export const listarInteresesPropiedad = async (req, res) => {
  try {
    const id_propiedad = parseInt(req.params.id, 10);
    if (isNaN(id_propiedad)) return res.status(400).json({ message: "ID de propiedad inválido" });

    const rows = await getInteresesByPropiedad(id_propiedad);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener intereses", error });
  }
};
