const express = require('express');
const router = express.Router();
const {requireToken} = require('../middlewares/authMiddleware');
const User = require('../models/user');

router.get('/', requireToken, async (req, res) => {
    try {
        res.json(await User.find({}).select('username'));
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;
