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
  // io.emit('joined', socket)
  console.log(socket);

  // Initial emit sent messages from db
  Message.find()
    .then(msg => {
      socket.emit("output", msg);
    })
    .catch(err => {
      sendStatus(err.response.message);
    });

  // New message
  socket.on("input", data => {
    const { msg, author, author_color } = data;
    if (msg === "" || !msg) return sendStatus("Please type in your message");
    if (!author) return sendStatus("Please log in to add new message");

    const newMessage = new Message({
      msg,
      author,
      author_color
    });

    newMessage.save((err, msg) => {
      if (err) throw err;
      // Emit new message
      io.emit("refresh", msg);
    });
  });

  sendStatus = s => {
    socket.emit("status", s);
  };
});
