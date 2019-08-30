const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// Get user schema
const User = require("../../models/User");

router.post("/", (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all credentials" });
  }

  // Check if user exist
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(400).json({ msg: "User does not exists" });
      }

      // Validate password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) {
          return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Return JWT token
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
                email: user.email,
                name_color: user.name_color
              }
            });
          }
        );
      });
    })
    .catch(err => console.log(err));
});

module.exports = router;
