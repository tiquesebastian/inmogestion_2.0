import {
  createContratoDocumento,
  getContratoDocumentoById,
  getContratosByCliente,
  getAllContratosDocumentos,
  updateArchivoPdf
} from "../models/contratoDocumento.model.js";
import {
  plantillaContratoApartamento,
  plantillaContratoCasa,
  plantillaContratoLote
} from "../utils/plantillasContrato.js";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { enviarEmailContratoGenerado } from '../services/email.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generar contrato de compraventa
 * POST /api/contratos/generar
 */
export const generarContrato = async (req, res) => {
  try {
    const contratoData = req.body;

    // Validar campos obligatorios
    const camposRequeridos = [
      'id_propiedad', 'id_cliente', 'tipo_inmueble',
      'vendedor_nombre', 'vendedor_apellido', 'vendedor_tipo_documento', 'vendedor_numero_documento',
      'comprador_nombre', 'comprador_apellido', 'comprador_tipo_documento', 'comprador_numero_documento',
      'inmueble_direccion', 'precio_venta', 'forma_pago', 'fecha_firma', 'generado_por'
    ];

    for (const campo of camposRequeridos) {
      if (!contratoData[campo]) {
        return res.status(400).json({ message: `El campo ${campo} es obligatorio` });
      }
    }

    // Validar tipo de inmueble
    if (!['Casa', 'Apartamento', 'Lote'].includes(contratoData.tipo_inmueble)) {
      return res.status(400).json({ message: 'Tipo de inmueble inválido' });
    }

    // Crear registro en base de datos
    const id_contrato_documento = await createContratoDocumento(contratoData);

    // Seleccionar plantilla según tipo
    let plantillaHTML;
    switch (contratoData.tipo_inmueble) {
      case 'Apartamento':
        plantillaHTML = plantillaContratoApartamento(contratoData);
        break;
      case 'Casa':
        plantillaHTML = plantillaContratoCasa(contratoData);
        break;
      case 'Lote':
        plantillaHTML = plantillaContratoLote(contratoData);
        break;
      default:
        return res.status(400).json({ message: 'Tipo de inmueble no soportado' });
    }

    // Generar PDF con Puppeteer
    const uploadsDir = path.join(__dirname, '../../uploads/contratos');
    console.log('📂 Directorio de contratos:', uploadsDir);
    
    if (!fs.existsSync(uploadsDir)) {
      console.log('📁 Creando directorio:', uploadsDir);
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `contrato_${id_contrato_documento}_${Date.now()}.pdf`;
    const filepath = path.join(uploadsDir, filename);
    console.log('📄 Generando PDF en:', filepath);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(plantillaHTML, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: filepath,
      format: 'Letter',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    await browser.close();

    // Guardar ruta relativa desde la raíz del proyecto (sin el / inicial)
    const rutaRelativa = `uploads/contratos/${filename}`;
    await updateArchivoPdf(id_contrato_documento, rutaRelativa);

    console.log('✅ Contrato generado:', {
      id: id_contrato_documento,
      archivo: rutaRelativa,
      ruta_fisica: filepath
    });

    // Enviar email al cliente (asíncrono, no bloquea la respuesta)
    if (contratoData.comprador_email) {
      enviarEmailContratoGenerado(contratoData)
        .then(() => console.log('📧 Email enviado al comprador'))
        .catch(err => console.error('❌ Error al enviar email:', err));
    }

    res.status(201).json({
      message: 'Contrato generado exitosamente',
      id_contrato_documento,
      archivo_pdf: rutaRelativa
    });
  } catch (error) {
    console.error('❌ Error generando contrato:', error);
    res.status(500).json({ message: 'Error al generar contrato', error: error.message });
  }
};

/**
 * Obtener contrato por ID
 * GET /api/contratos/:id
 */
export const getContrato = async (req, res) => {
  try {
    const { id } = req.params;
    const contrato = await getContratoDocumentoById(id);

    if (!contrato) {
      return res.status(404).json({ message: 'Contrato no encontrado' });
    }

    res.json(contrato);
  } catch (error) {
    console.error('❌ Error obteniendo contrato:', error);
    res.status(500).json({ message: 'Error al obtener contrato', error: error.message });
  }
};

/**
 * Obtener todos los contratos de un cliente
 * GET /api/contratos/cliente/:id_cliente
 */
export const getContratosPorCliente = async (req, res) => {
  try {
    const { id_cliente } = req.params;
    const contratos = await getContratosByCliente(id_cliente);

    res.json(contratos);
  } catch (error) {
    console.error('❌ Error obteniendo contratos del cliente:', error);
    res.status(500).json({ message: 'Error al obtener contratos', error: error.message });
  }
};

/**
 * Obtener todos los contratos (admin/agente)
 * GET /api/contratos
 */
export const getTodosLosContratos = async (req, res) => {
  try {
    const contratos = await getAllContratosDocumentos();
    res.json(contratos);
  } catch (error) {
    console.error('❌ Error obteniendo todos los contratos:', error);
    res.status(500).json({ message: 'Error al obtener contratos', error: error.message });
  }
};

/**
 * Descargar PDF del contrato
 * GET /api/contratos/descargar/:id
 */
export const descargarContrato = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📥 Intentando descargar contrato ID:', id);
    
    const contrato = await getContratoDocumentoById(id);

    if (!contrato) {
      console.log('❌ Contrato no encontrado en BD');
      return res.status(404).json({ message: 'Contrato no encontrado' });
    }

    if (!contrato.archivo_pdf) {
      console.log('❌ Contrato sin archivo_pdf:', contrato);
      return res.status(404).json({ message: 'Archivo PDF no generado aún. Por favor, genera el contrato primero.' });
    }

    // Limpiar la ruta: quitar "/" inicial si existe
    let rutaArchivo = contrato.archivo_pdf;
    if (rutaArchivo.startsWith('/')) {
      rutaArchivo = rutaArchivo.substring(1);
    }

    // Construir ruta absoluta
    const filepath = path.resolve(__dirname, '../../', rutaArchivo);
    console.log('📂 Ruta del archivo (resolve):', filepath);
    console.log('📂 Archivo_pdf de BD:', contrato.archivo_pdf);
    console.log('📂 Ruta limpia:', rutaArchivo);

    if (!fs.existsSync(filepath)) {
      console.log('❌ Archivo no existe en la ruta:', filepath);
      
      // Intentar encontrar el archivo
      const uploadsDir = path.resolve(__dirname, '../../uploads/contratos');
      console.log('📁 Buscando en directorio:', uploadsDir);
      
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        console.log('📋 Archivos encontrados:', files);
      }
      
      return res.status(404).json({ 
        message: 'Archivo no encontrado en el servidor',
        ruta_esperada: contrato.archivo_pdf,
        ruta_absoluta: filepath
      });
    }

    console.log('✅ Enviando archivo:', filepath);
    
    // Configurar headers para forzar descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="contrato_${id}.pdf"`);
    
    // Usar stream para enviar el archivo (más robusto)
    try {
      const fileStream = fs.createReadStream(filepath);
      
      fileStream.on('error', (err) => {
        console.error('❌ Error al leer archivo:', err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error al leer archivo' });
        }
      });
      
      fileStream.on('open', () => {
        console.log('✅ Stream abierto, enviando archivo...');
      });
      
      fileStream.on('end', () => {
        console.log('✅ Archivo enviado completamente');
      });
      
      fileStream.pipe(res);
      
    } catch (streamError) {
      console.error('❌ Error al crear stream:', streamError);
      res.status(500).json({ message: 'Error al crear stream de archivo' });
    }
  } catch (error) {
    console.error('❌ Error descargando contrato:', error);
    res.status(500).json({ message: 'Error al descargar contrato', error: error.message });
  }
};
