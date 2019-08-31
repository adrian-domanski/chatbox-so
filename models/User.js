const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 12
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name_color: {
    type: String,
    default: "black"
  },
  msg_count: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("user", userSchema);
