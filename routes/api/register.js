const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const validator = require("validator");

// Get user schema
const User = require("../../models/User");

router.post("/", (req, res) => {
  const { name, email, password } = req.body;

  // // // // // //
  //  Validation //
  // // // // // //

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all credentials" });
  }

  // Password - min 8 chars
  if (password.length < 8) {
    return res
      .status(400)
      .json({ msg: "Password must contains at least 8 characters" });
  }

  // Name - max 12 chars
  if (name.length > 12) {
    return res
      .status(400)
      .json({ msg: "Name might have at most 12 characters" });
  }

  // Name only letters
  if (!validator.isAlpha(name)) {
    return res.status(400).json({ msg: "Name may contains only letters A-Z" });
  }

  // Correct email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ msg: "Invalid email" });
  }

  // Check if email already exist
  User.findOne({ email })
    .then(user => {
      if (user) {
        return res
          .status(400)
          .json({ msg: "User with that email already exist" });
      }
    })
    .catch(err => console.log(err));

  // Check if name already exist
  User.findOne({ name })
    .then(user => {
      if (user) {
        return res
          .status(400)
          .json({ msg: "User with that name already exist" });
      }
    })
    .catch(err => console.log(err));

  // Create user
  const newUser = new User({
    name,
    email,
    password
  });

  // Generate salt and hash password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      // Replace plain password with hash
      newUser.password = hash;
      // Save user
      newUser
        .save()
        .then(user => {
          // Generate JWT
          jwt.sign(
            { id: user._id },
            config.get("jwtSecret"),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              // Return response
              res.json({
                token,
                user: {
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  name_color: user.name_color,
                  rank: user.rank
                }
              });
            }
          );
        })
        .catch(err => console.log(err));
    });
  });
});

module.exports = router;
