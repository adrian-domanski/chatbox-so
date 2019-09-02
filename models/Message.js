const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  msg: {
    type: String,
    require: true
  },
  author: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  author_color: {
    type: String,
    required: true
  },
  author_rank: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("message", messageSchema);
