const express = require('express');
const router = express.Router();
const User = require('../models/user');

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    res.render('users', { users: await User.find() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
