const express = require('express');
const router = express.Router();

// Get schemas
const Message = require('../../models/Message');
const User = require('../../models/User');

// These routes are only for demo purposes, they are not beeing used in production

// Get 100 latest messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().limit(100).sort({ date: -1 });
    res.json({ messages });
  } catch (err) {
    console.log(err);
  }
});

// Add new messages
router.post('/', async (req, res) => {
  try {
    // Validation
    let { msg, author, author_color, author_rank } = req.body;
    if (msg === '' || !msg)
      return res.status(400).send("Error: no 'msg' property provided");
    if (!author)
      return res.status(400).send("Error: no 'author' property provided");
    if (!author_color) author_color = 'green';
    if (!author_rank) author_rank = ' ';

    // Check if author exist
    const user = await User.findOne({ name: author });
    if (!user)
      return res
        .status(400)
        .send("Error: author with that name doesn't exist!");

    const newMessage = new Message({
      msg,
      author,
      author_color,
      author_rank,
    });

    const savedMsg = await newMessage.save();
    // Increment post count
    await User.updateOne({ name: author }, { $inc: { msg_count: 1 } }).exec();

    console.log(savedMsg);
    res.json(savedMsg);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
