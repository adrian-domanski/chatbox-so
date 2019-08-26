const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const app = express();

// Connect to MongoDB
const db = config.get("mongoURI");
mongoose.connect(db, { useCreateIndex: true, useNewUrlParser: true }, () =>
  console.log("MongoDB Connected...")
);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}...`)
);
