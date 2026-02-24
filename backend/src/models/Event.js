const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      minlength: [3, "El título debe tener al menos 3 caracteres"]
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
      minlength: [10, "La descripción debe tener al menos 10 caracteres"]
    },
    categoria: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true
    },
    ubicacion: {
      type: String,
      required: [true, "La ubicación es obligatoria"],
      trim: true
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
      max: [10000, "El precio no puede superar 10000"]
    },
    fecha: {
      type: Date,
      required: [true, "La fecha es obligatoria"]
    },
    esPublico: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

eventSchema.index({ titulo: 1, fecha: 1 }, { unique: true });

module.exports = mongoose.model("Event", eventSchema);
