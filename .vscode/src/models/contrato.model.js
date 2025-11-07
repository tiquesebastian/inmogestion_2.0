import db from "../config/db.js";

export const insertContrato = async ({
	fecha_contrato,
	valor_venta,
	fecha_venta = null,
	archivo_pdf = null,
	id_propiedad,
	id_cliente,
	id_usuario,
	estado_contrato = 'Activo'
}) => {
	const [result] = await db.query(
		`INSERT INTO contrato (fecha_contrato, valor_venta, fecha_venta, archivo_pdf, id_propiedad, id_cliente, id_usuario, estado_contrato)
		 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		[fecha_contrato, valor_venta, fecha_venta, archivo_pdf, id_propiedad, id_cliente, id_usuario, estado_contrato]
	);
	return result.insertId;
};

export const getAllContratos = async () => {
	const [rows] = await db.query(`SELECT * FROM contrato ORDER BY fecha_contrato DESC`);
	return rows;
};

export const getContrato = async (id_contrato) => {
	const [rows] = await db.query(`SELECT * FROM contrato WHERE id_contrato = ?`, [id_contrato]);
	return rows[0];
};

export const getContratosPorPropiedad = async (id_propiedad) => {
	const [rows] = await db.query(`SELECT * FROM contrato WHERE id_propiedad = ? ORDER BY fecha_contrato DESC`, [id_propiedad]);
	return rows;
};

export const getContratosPorCliente = async (id_cliente) => {
	const [rows] = await db.query(`SELECT * FROM contrato WHERE id_cliente = ? ORDER BY fecha_contrato DESC`, [id_cliente]);
	return rows;
};

export const updateEstadoContrato = async (id_contrato, estado_contrato) => {
	const [result] = await db.query(`UPDATE contrato SET estado_contrato = ? WHERE id_contrato = ?`, [estado_contrato, id_contrato]);
	return result;
};

export const deleteContratoById = async (id_contrato) => {
	const [result] = await db.query(`DELETE FROM contrato WHERE id_contrato = ?`, [id_contrato]);
	return result;
};
