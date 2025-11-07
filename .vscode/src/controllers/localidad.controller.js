import pool from '../config/db.js';

/**
 * Obtener todas las localidades
 */
export const obtenerLocalidades = async (req, res) => {
  try {
    const [localidades] = await pool.query(
      'SELECT id_localidad, nombre_localidad FROM localidad ORDER BY nombre_localidad ASC'
    );
    
    res.json(localidades);
  } catch (error) {
    console.error('Error al obtener localidades:', error);
    res.status(500).json({ message: 'Error al obtener localidades' });
  }
};

/**
 * Obtener barrios por localidad
 */
export const obtenerBarriosPorLocalidad = async (req, res) => {
  try {
    const { id_localidad } = req.query;
    
    if (!id_localidad) {
      return res.status(400).json({ message: 'Se requiere el parámetro id_localidad' });
    }
    
    const [barrios] = await pool.query(
      'SELECT id_barrio, nombre_barrio, id_localidad FROM barrio WHERE id_localidad = ? ORDER BY nombre_barrio ASC',
      [id_localidad]
    );
    
    res.json(barrios);
  } catch (error) {
    console.error('Error al obtener barrios:', error);
    res.status(500).json({ message: 'Error al obtener barrios' });
  }
};

/**
 * Obtener una localidad específica
 */
export const obtenerLocalidadPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [localidades] = await pool.query(
      'SELECT id_localidad, nombre_localidad FROM localidad WHERE id_localidad = ?',
      [id]
    );
    
    if (localidades.length === 0) {
      return res.status(404).json({ message: 'Localidad no encontrada' });
    }
    
    res.json(localidades[0]);
  } catch (error) {
    console.error('Error al obtener localidad:', error);
    res.status(500).json({ message: 'Error al obtener localidad' });
  }
};
