import pool from '../config/db.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Obtener todas las imágenes de una propiedad
 */
export const obtenerImagenesPorPropiedad = async (req, res) => {
  try {
    const { id_propiedad } = req.params;
    
    const [imagenes] = await pool.query(
      'SELECT * FROM imagen_propiedad WHERE id_propiedad = ? ORDER BY prioridad DESC',
      [id_propiedad]
    );
    
    res.json(imagenes);
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    res.status(500).json({ message: 'Error al obtener imágenes' });
  }
};

/**
 * Subir una imagen para una propiedad
 */
export const subirImagen = async (req, res) => {
  try {
    const { id_propiedad, prioridad, descripcion } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha proporcionado ninguna imagen' });
    }
    
    // Límite de imágenes por propiedad: 10
    const [conteoRows] = await pool.query(
      'SELECT COUNT(*) AS total FROM imagen_propiedad WHERE id_propiedad = ?',
      [id_propiedad]
    );
    const totalActual = conteoRows?.[0]?.total || 0;
    if (totalActual >= 10) {
      return res.status(409).json({ message: 'Se alcanzó el límite de 10 imágenes para esta propiedad' });
    }
    
    // Construir la URL de la imagen (ruta relativa o absoluta según tu configuración)
    const url = `/uploads/${req.file.filename}`;
    
    const [result] = await pool.query(
      'INSERT INTO imagen_propiedad (id_propiedad, url, prioridad, descripcion) VALUES (?, ?, ?, ?)',
      [id_propiedad, url, prioridad || 0, descripcion || null]
    );
    
    res.status(201).json({
      id_imagen: result.insertId,
      id_propiedad,
      url,
      prioridad: prioridad || 0,
      descripcion: descripcion || null
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ message: 'Error al subir imagen' });
  }
};

/**
 * Eliminar una imagen
 */
export const eliminarImagen = async (req, res) => {
  try {
    const { id_imagen } = req.params;
    
    // Obtener la información de la imagen antes de eliminarla
    const [imagenes] = await pool.query(
      'SELECT url FROM imagen_propiedad WHERE id_imagen = ?',
      [id_imagen]
    );
    
    if (imagenes.length === 0) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }
    
    const imagen = imagenes[0];
    
    // Eliminar el archivo físico
    try {
      const filePath = path.join(__dirname, '../../', imagen.url);
      await fs.unlink(filePath);
    } catch (fileError) {
      console.warn('No se pudo eliminar el archivo físico:', fileError);
    }
    
    // Eliminar el registro de la base de datos
    await pool.query('DELETE FROM imagen_propiedad WHERE id_imagen = ?', [id_imagen]);
    
    res.json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    res.status(500).json({ message: 'Error al eliminar imagen' });
  }
};

/**
 * Actualizar prioridad de una imagen
 */
export const actualizarPrioridad = async (req, res) => {
  try {
    const { id_imagen } = req.params;
    const { prioridad } = req.body;
    
    await pool.query(
      'UPDATE imagen_propiedad SET prioridad = ? WHERE id_imagen = ?',
      [prioridad, id_imagen]
    );
    
    res.json({ message: 'Prioridad actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar prioridad:', error);
    res.status(500).json({ message: 'Error al actualizar prioridad' });
  }
};
