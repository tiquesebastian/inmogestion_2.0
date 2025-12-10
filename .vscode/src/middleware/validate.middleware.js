// Validación ligera sin dependencia externa (puedes migrar a Joi/Yup luego)
export const validate = (rules) => (req, res, next) => {
  const errors = [];
  for (const r of rules) {
    const value = req.body[r.field];
    if (r.required && (value === undefined || value === null || value === '')) {
      errors.push(`${r.field} es requerido`);
      continue;
    }
    if (value && r.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      errors.push(`${r.field} formato inválido`);
    }
    if (value && r.minLength && String(value).length < r.minLength) {
      errors.push(`${r.field} debe tener mínimo ${r.minLength} caracteres`);
    }
  }
  if (errors.length) return res.status(400).json({ message: 'Validación fallida', errors });
  next();
};
