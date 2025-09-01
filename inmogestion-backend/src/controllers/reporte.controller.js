import db from "../config/db.js"; // Importa la conexión a la base de datos


//  Obtener todos los reportes de ventas generados
export const getReportes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM reporte_ventas");
    res.json(rows); // Devuelve todos los reportes existentes
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reportes", error });
  }
};

//  Obtener un reporte específico por su ID
export const getReporteById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM reporte_ventas WHERE id_reporte = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    res.json(rows[0]); // Devuelve el reporte si existe
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reporte", error });
  }
};

//  Crear un nuevo reporte de ventas
export const createReporte = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, id_usuario } = req.body;

    // Validar campos obligatorios
    if (!fecha_inicio || !fecha_fin || !id_usuario) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    //  Calcular automáticamente el total de ventas en el rango indicado
    const [ventas] = await db.query(
      `SELECT SUM(valor_venta) AS total_ventas 
       FROM contrato 
       WHERE fecha_venta BETWEEN ? AND ?`,
      [fecha_inicio, fecha_fin]
    );

    const total_ventas = ventas[0].total_ventas || 0; // Si no hay ventas, se asigna 0

    //  Insertar el reporte con total de ventas incluido
    const [result] = await db.query(
      "INSERT INTO reporte_ventas (fecha_inicio, fecha_fin, total_ventas, id_usuario) VALUES (?, ?, ?, ?)",
      [fecha_inicio, fecha_fin, total_ventas, id_usuario]
    );

    res.status(201).json({
      message: "Reporte creado exitosamente",
      id_reporte: result.insertId, // ID del nuevo reporte
      total_ventas,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear reporte", error });
  }
};

//  Obtener todos los reportes generados por un usuario específico
export const getReportesByUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM reporte_ventas WHERE id_usuario = ?",
      [idUsuario]
    );

    res.json(rows); // Devuelve todos los reportes del usuario
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reportes por usuario", error });
  }
};

//  Obtener el total de ventas en un rango de fechas (sin crear un reporte)
export const getTotalVentas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    // Validación: ambas fechas son necesarias
    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ message: "Debes enviar fecha_inicio y fecha_fin" });
    }

    const [ventas] = await db.query(
      `SELECT SUM(valor_venta) AS total_ventas 
       FROM contrato 
       WHERE fecha_venta BETWEEN ? AND ?`,
      [fecha_inicio, fecha_fin]
    );

    res.json({
      fecha_inicio,
      fecha_fin,
      total_ventas: ventas[0].total_ventas || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener total de ventas", error });
  }
};

// Reporte especial: rendimiento de cada agente
export const getRendimientoAgentes = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ message: "Debes enviar fecha_inicio y fecha_fin" });
    }

    const [rows] = await db.query(
      `SELECT 
          u.id_usuario,
          u.nombre,
          u.apellido,
          COUNT(c.id_contrato) AS contratos_realizados,
          COALESCE(SUM(c.valor_venta), 0) AS total_ventas
       FROM usuario u
       LEFT JOIN contrato c ON u.id_usuario = c.id_usuario 
         AND c.fecha_venta BETWEEN ? AND ?
       GROUP BY u.id_usuario, u.nombre, u.apellido
       ORDER BY total_ventas DESC`,
      [fecha_inicio, fecha_fin]
    );

    res.json({
      fecha_inicio,
      fecha_fin,
      agentes: rows
    });
  } catch (error) {
    res.status(500).json({ message: "Error al generar reporte de agentes", error });
  }
};



//  Obtener reporte de cantidad de clientes con estado "Activo"
export const getClientesActivos = async (req, res) => {
  try {
    //  Consulta SQL: cuenta todos los clientes cuyo estado sea "Activo"
    const [rows] = await db.query(
      `SELECT COUNT(*) AS total_activos 
       FROM cliente 
       WHERE estado_cliente = 'Activo'`
    );

    //  Extrae el número total de activos desde el resultado
    const totalActivos = rows[0]?.total_activos || 0;

    //  Si no hay clientes activos, se responde con un mensaje claro
    if (totalActivos === 0) {
      return res.status(200).json({
        message: "No hay clientes activos actualmente",
        total_activos: 0,
      });
    }

    //  Si hay clientes activos, se devuelve el total
    res.status(200).json({
      message: "Reporte de clientes activos generado correctamente",
      total_activos: totalActivos,
    });
    
  } catch (error) {
    //  Manejo de errores: log y respuesta con mensaje de fallo
    console.error("❌ Error generando reporte de clientes activos:", error);
    res.status(500).json({
      message: "Error al generar el reporte de clientes activos",
      error: error.message,
    });
  }
};

//  Obtener reporte de propiedades con estado "Disponible"
export const getPropiedadesDisponibles = async (req, res) => {
  try {
    //  Consulta SQL: selecciona propiedades que estén disponibles
    const [rows] = await db.query(
      `SELECT 
         id_propiedad, 
         tipo_propiedad, 
         direccion_formato, 
         precio_propiedad, 
         estado_propiedad
       FROM propiedad
       WHERE estado_propiedad = 'Disponible'`
    );

    //  Si no hay propiedades disponibles, devuelve mensaje claro
    if (rows.length === 0) {
      return res.status(200).json({
        message: "No hay propiedades disponibles actualmente",
        total_disponibles: 0,
        propiedades: [], // Lista vacía
      });
    }

    //  Devuelve lista de propiedades disponibles y su cantidad
    res.status(200).json({
      message: "Reporte de propiedades disponibles generado correctamente",
      total_disponibles: rows.length,
      propiedades: rows, // Lista con info de propiedades
    });

  } catch (error) {
    //  Manejo de errores
    console.error("❌ Error generando reporte de propiedades disponibles:", error);
    res.status(500).json({
      message: "Error al generar el reporte de propiedades disponibles",
      error: error.message,
    });
  }
};


//  Obtener reporte de ventas realizadas (propiedades con estado 'Vendida')
export const getVentasRealizadas = async (req, res) => {
  try {
    //  Consulta SQL:
    // Se obtienen contratos relacionados a propiedades vendidas
    const [rows] = await db.query(
      `SELECT 
         c.id_contrato, 
         p.tipo_propiedad, 
         p.direccion_formato, 
         c.valor_venta, 
         c.fecha_venta
       FROM contrato c
       INNER JOIN propiedad p ON c.id_propiedad = p.id_propiedad
       WHERE p.estado_propiedad = 'Vendida'`
    );

    //  Inicializamos el total de ingresos por ventas
    let totalVentas = 0;

    //  Sumamos el valor de cada venta
    rows.forEach(r => totalVentas += parseFloat(r.valor_venta));

    //  Si no hay ventas, devolvemos una respuesta clara
    if (rows.length === 0) {
      return res.status(200).json({
        message: "No hay ventas registradas actualmente",
        total_ventas: 0,         // Cantidad de ventas realizadas
        total_ingresos: 0,       // Monto total ingresado por ventas
        ventas: [],              // Lista vacía de ventas
      });
    }

    //  Si hay ventas, devolvemos los datos con métricas
    res.status(200).json({
      message: "Reporte de ventas generado correctamente",
      total_ventas: rows.length,  // Número de ventas registradas
      total_ingresos: totalVentas, // Suma de todos los valores de venta
      ventas: rows,               // Detalle de cada venta
    });

  } catch (error) {
    //  Manejo de errores
    console.error("❌ Error generando reporte de ventas:", error);
    res.status(500).json({
      message: "Error al generar el reporte de ventas",
      error: error.message,
    });
  }
};


