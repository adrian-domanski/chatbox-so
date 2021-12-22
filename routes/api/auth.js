const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

router.get('/', (req, res) => {
  const token = req.headers['x-auth-token'];

  if (!token) {
    return res.status(401).json({ msg: 'No token - access denied' });
  }

  const decoded = jwt.decode(token, config.get('jwtSecret'));

  User.findById(decoded.id, (err, user) => {
    if (err) throw err;

    res.json(user);
  }).select('-password');
});

module.exports = router;
