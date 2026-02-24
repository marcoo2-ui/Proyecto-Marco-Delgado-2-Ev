const express = require("express");
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require("../controllers/eventsController");

const router = express.Router();

router.get("/get/all", getAllEvents);
router.get("/get/:id", getEventById);
router.post("/post", createEvent);
router.put("/update/:id", updateEvent);
router.patch("/update/:id", updateEvent);
router.delete("/delete/:id", deleteEvent);

module.exports = router;
