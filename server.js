const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const { connectDB } = require("./config/db");

const app = express();

app.use(express.json());

connectDB();

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});


// Routes
app.use("/api/todos", require("./routes/todoRoutes"));

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

// close HTTP server and DB connection
const gracefulShutdown = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  } catch (e) {
    console.error("Error during MongoDB disconnection:", e.message);
  } finally {
    server.close(() => process.exit(0));
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
