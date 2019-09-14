const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const socket = require("socket.io");
const path = require("path");
const Message = require("./models/Message");
const User = require("./models/User");
const app = express();

// Add parser
app.use(express.json());

// Routes
app.use("/api/register", require("./routes/api/register"));
app.use("/api/login", require("./routes/api/login"));
app.use("/api/auth", require("./routes/api/auth"));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

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

let active_users = 0;

io.on("connection", socket => {
  // Emit active users amount
  active_users += 1;
  io.emit("active", active_users);

  socket.on("disconnect", () => {
    active_users -= 1;
    io.emit("active", active_users);
  });

  // Emit top spamers
  User.find()
    .sort({ msg_count: -1 })
    .limit(10)
    .then(users => {
      io.emit("spamers", users);
    });

  // Initial emit sent messages from db
  Message.find()
    .limit(100)
    .sort({ date: -1 })
    .then(msg => {
      socket.emit("output", msg);
    })
    .catch(err => {
      sendStatus(err.response.message);
    });

  // Typing event
  socket.on("typing", name => {
    socket.broadcast.emit("typing", name);
  });

  // Clear typing event
  socket.on("stopTyping", name => {
    socket.broadcast.emit("stopTyping", name);
  });

  // New message
  socket.on("input", data => {
    const { msg, author, author_color, author_rank } = data;
    if (msg === "" || !msg) return sendStatus("Please type in your message");
    if (!author) return sendStatus("Please log in to add new message");

    const newMessage = new Message({
      msg,
      author,
      author_color,
      author_rank
    });

    newMessage.save((err, msg) => {
      if (err) throw err;
      // Emit new message
      io.emit("refresh", msg);

      // Increment post count
      User.updateOne({ name: author }, { $inc: { msg_count: 1 } }).exec();
    });
  });

  sendStatus = s => {
    socket.emit("status", s);
  };
});
