const Event = require("../models/Event");
const validateBusinessRules = require("../utils/businessRules");

const buildFilters = (query) => {
  const filters = {};
  if (query.categoria) {
    filters.categoria = query.categoria;
  }
  if (query.q) {
    filters.titulo = { $regex: query.q, $options: "i" };
  }
  return filters;
};

const getAllEvents = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit || "10", 10), 1);
    const filters = buildFilters(req.query);

    const [total, eventos] = await Promise.all([
      Event.countDocuments(filters),
      Event.find(filters)
        .sort({ fecha: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
    ]);

    res.status(200).json({
      data: eventos,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const evento = await Event.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res.status(200).json({ data: evento });
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const errors = validateBusinessRules(req.body);
    if (errors.length) {
      return res.status(400).json({ message: "Reglas de negocio", errors });
    }

    const evento = await Event.create(req.body);
    res.status(201).json({ data: evento, message: "Evento creado correctamente" });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const errors = validateBusinessRules(req.body);
    if (errors.length) {
      return res.status(400).json({ message: "Reglas de negocio", errors });
    }

    const evento = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.status(200).json({ data: evento, message: "Evento actualizado" });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const evento = await Event.findByIdAndDelete(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res.status(200).json({ message: "Evento eliminado" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
