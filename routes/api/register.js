const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// Get user schema
const User = require("../../models/User");

router.post("/", (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all credentials" });
  }

  // Password - min 8 chars
  if (password.length < 8) {
    return res
      .status(400)
      .json({ msg: "Password must contains at least 8 characters" });
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

              res.json({
                token,
                user: {
                  id: user._id,
                  name: user.name,
                  email: user.email
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
