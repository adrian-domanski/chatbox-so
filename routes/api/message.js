const express = require("express");
const router = express.Router();

const Message = require("../../models/Message");

router.post("/", (req, res) => {
  const { msg, author } = req.body;

  // Validation
  if (!msg) return res.status(400).json({ msg: "Please type in your message" });
  if (!author)
    return res.status(400).json({ msg: "Please log in to add new message" });

  const newMessage = new Message({
    msg,
    author
  });

  newMessage.save().then(msg => {
    res.json(msg);
  });
});

module.exports = router;
