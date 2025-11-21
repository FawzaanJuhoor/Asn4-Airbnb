/******************************************************************************
***
* ITE5315 – Assignment 4
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Fawzaan Juhoor Student ID: N01707140 Date: Nov 20,2025
*
*
******************************************************************************
**/


require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/database");

const app = express();

// Built-in Express body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// hbs setup
const exphbs = require("express-handlebars");

const path = require("path");

app.engine("hbs", exphbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
    helpers: {
        eq: (a, b) => a === b,
        add: (a, b) => a + b,
        subtract: (a, b) => a - b
    }
}));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


// MongoDB Employee connection
// mongoose.connect(config.url)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("Connection error:", err));

const db = mongoose.connection;

// MongoDB Airbnb connection
mongoose.connect(process.env.MONGO_URI_AIRBNB)
  .then(() => console.log("Airbnb DB connected"))
  .catch((err) => console.error("Airbnb DB connection error:", err));

// Event logs
db.on("connected", () => console.log("Mongoose connected"));
db.on("error", (err) => console.error("Mongoose error:", err));
db.on("disconnected", () => console.log("Mongoose disconnected"));

// Load Employee routes
const employeeRoutes = require("./routes/employees");
app.use("/api/employees", employeeRoutes);

// Load Airbnb routes
const airbnbRoutes = require("./routes/airbnb");
app.use("/api/airbnb", airbnbRoutes);

const airbnbViewRoutes = require("./routes/airbnb_view");
app.use("/", airbnbViewRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors
    });
  }

  res.status(500).json({ message: "Internal Server Error" });
});

// Graceful shutdown 
process.on("SIGINT", async () => {
  await db.close();
  console.log("Mongoose disconnected on app termination");
  process.exit(0);
});

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});