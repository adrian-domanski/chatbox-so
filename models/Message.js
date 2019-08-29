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
  }
});

module.exports = mongoose.model("message", messageSchema);
