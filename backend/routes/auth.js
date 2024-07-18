const express = require('express');
const axios = require('axios');
const router = express.Router();
const {matchedData, validationResult} = require('express-validator');
const notEmptyBody = require('../middlewares/notEmptyBody');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const duplicateErrorCode = 11000;

router.post('/register', notEmptyBody(['username', 'token', 'password']), async (req, res) => {
    try {
        const body = matchedData(req);

        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${body.token}`
        );
        if (!response.data.success) {
            res.status(401).json({message: 'Captcha verification failed'});
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);
        const user = new User({username: body.username, password: hashedPassword});
        await user.save();

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({message: 'User registered successfully', token: token});
    } catch (error) {
        if (error.code === duplicateErrorCode) {
            return res.status(409).json({error: 'User with provided username already exists'});
        }
        res.status(500).json({error: 'Registration failed'});
    }
});

// User login
router.post('/login', notEmptyBody(['username', 'password']), async (req, res) => {
    try {
        const body = matchedData(req);

        const user = await User.findOne({username: body.username});

        if (!user) {
            return res.status(401).json({error: 'Authentication failed'});
        }
        const passwordMatch = await bcrypt.compare(body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({error: 'Authentication failed'});
        }
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({error: 'Login failed'});
    }
});

module.exports = router;