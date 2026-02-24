const validateBusinessRules = (data) => {
  const errors = [];
  if (data.precio !== undefined) {
    if (data.precio < 0 || data.precio > 10000) {
      errors.push('El precio debe estar entre 0 y 10000');
    }
  }
  if (data.fecha) {
    const fecha = new Date(data.fecha);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (fecha < today) {
      errors.push('La fecha no puede ser anterior a hoy');
    }
  }
  if (data.titulo && data.descripcion && data.titulo.length > data.descripcion.length) {
    errors.push('La descripción debe ser más larga que el título');
  }
  return errors;
};

module.exports = validateBusinessRules;
