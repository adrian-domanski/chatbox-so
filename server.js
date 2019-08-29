const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const socket = require("socket.io");
const Message = require("./models/Message");
const app = express();

// Add parser
app.use(express.json());

// Routes
app.use("/api/register", require("./routes/api/register"));
app.use("/api/login", require("./routes/api/login"));
app.use("/api/auth", require("./routes/api/auth"));

// Connect to MongoDB
const db = config.get("mongoURI");
mongoose.connect(db, { useCreateIndex: true, useNewUrlParser: true }, () =>
  console.log("MongoDB Connected...")
);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}...`)
);

// Socket.io
const io = socket(server);

io.on("connection", socket => {
  // Get message
  socket.on("message", data => {
    const { msg, author } = data;

    if (msg === "" || !msg) sendStatus("Please type in your message");

    const newMessage = new Message({
      msg,
      author
    });

    newMessage.save((err, msg) => {
      if (err) throw err;
      // Emit new message
      socket.emit("message", msg);
    });
  });

  sendStatus = s => {
    socket.emit("status", s);
  };
});
