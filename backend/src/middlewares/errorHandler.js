const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: "Evento duplicado",
      errors: ["Ya existe un evento con el mismo título y fecha"]
    });
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({ message: "Validación", errors });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "ID inválido" });
  }

  return res.status(500).json({ message: "Error interno del servidor" });
};

module.exports = errorHandler;
