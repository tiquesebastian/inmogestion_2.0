import multer from 'multer';
import path from 'path';
import fs from 'fs';
import DocumentoCliente from '../models/documentoCliente.model.js';

// Configurar multer para documentos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads/documentos-clientes';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'doc-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo
  fileFilter: function (req, file, cb) {
    // Permitir PDFs, imágenes, documentos
    const allowedTypes = /pdf|jpg|jpeg|png|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF, JPG, PNG, DOC, DOCX'));
    }
  }
});

// Subir documento
const subirDocumento = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    const { cliente_id, tipo_documento, descripcion } = req.body;
    
    if (!cliente_id || !tipo_documento) {
      return res.status(400).json({ error: 'cliente_id y tipo_documento son requeridos' });
    }

    const documentoId = await DocumentoCliente.create({
      cliente_id,
      tipo_documento,
      nombre_archivo: req.file.originalname,
      ruta_archivo: req.file.path,
      descripcion,
      subido_por: req.user.id
    });

    res.json({
      message: 'Documento subido exitosamente',
      documento_id: documentoId,
      archivo: req.file.filename
    });
  } catch (error) {
    console.error('Error al subir documento:', error);
    res.status(500).json({ error: 'Error al subir documento' });
  }
};

// Obtener documentos por cliente
const getDocumentosPorCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const documentos = await DocumentoCliente.getByCliente(clienteId);
    res.json(documentos);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ error: 'Error al obtener documentos' });
  }
};

// Obtener todos los documentos (admin)
const getTodosLosDocumentos = async (req, res) => {
  try {
    const documentos = await DocumentoCliente.getAll();
    res.json(documentos);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ error: 'Error al obtener documentos' });
  }
};

// Descargar documento
const descargarDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const documento = await DocumentoCliente.getById(id);

    if (!documento) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    // Verificar que el archivo existe
    if (!fs.existsSync(documento.ruta_archivo)) {
      return res.status(404).json({ error: 'Archivo no encontrado en el servidor' });
    }

    res.download(documento.ruta_archivo, documento.nombre_archivo);
  } catch (error) {
    console.error('Error al descargar documento:', error);
    res.status(500).json({ error: 'Error al descargar documento' });
  }
};

// Eliminar documento
const eliminarDocumento = async (req, res) => {
  try {
    const { id } = req.params;
    const documento = await DocumentoCliente.getById(id);

    if (!documento) {
      return res.status(404).json({ error: 'Documento no encontrado' });
    }

    // Eliminar archivo físico
    if (fs.existsSync(documento.ruta_archivo)) {
      fs.unlinkSync(documento.ruta_archivo);
    }

    // Eliminar registro de BD
    await DocumentoCliente.delete(id);

    res.json({ message: 'Documento eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    res.status(500).json({ error: 'Error al eliminar documento' });
  }
};

export {
  upload,
  subirDocumento,
  getDocumentosPorCliente,
  getTodosLosDocumentos,
  descargarDocumento,
  eliminarDocumento
};
