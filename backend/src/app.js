const express = require("express");
const cors = require("cors");
const eventsRoutes = require("./routes/eventsRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

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
