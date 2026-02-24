const express = require("express");
const cors = require("cors");
const eventsRoutes = require("./routes/eventsRoutes");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API de Eventos 360 activa",
    docs: "/api/v1/documentacion"
  });
});

app.get("/api/v1/documentacion", (req, res) => {
  res.status(200).json({
    endpoints: [
      { method: "GET", path: "/api/v1/documentacion" },
      { method: "GET", path: "/api/v1/eventos/get/all" },
      { method: "GET", path: "/api/v1/eventos/get/:id" },
      { method: "POST", path: "/api/v1/eventos/post" },
      { method: "PUT", path: "/api/v1/eventos/update/:id" },
      { method: "PATCH", path: "/api/v1/eventos/update/:id" },
      { method: "DELETE", path: "/api/v1/eventos/delete/:id" }
    ]
  });
});

app.use("/api/v1/eventos", eventsRoutes);

app.use(errorHandler);

module.exports = app;
