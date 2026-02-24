require("dotenv").config();
const connectDB = require("./config/db");
const Event = require("./models/Event");
const seedEvents = require("./data/events");

const seedDatabase = async () => {
  try {
    await connectDB();
    await Event.deleteMany();
    await Event.insertMany(seedEvents);
    console.log("Base de datos poblada con eventos.");
    process.exit(0);
  } catch (error) {
    console.error("Error al poblar la base de datos", error);
    process.exit(1);
  }
};

seedDatabase();
