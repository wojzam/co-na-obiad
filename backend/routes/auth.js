const express = require('express');
const router = express.Router();
const {matchedData, validationResult} = require('express-validator');
const notEmptyBody = require('../middlewares/notEmptyBody');
const authService = require('../services/authService');
require('dotenv').config();

router.post('/register', notEmptyBody(['username', 'password', 'token']), async (req, res) => {
    try {
        const body = matchedData(req);
        const result = await authService.register(body.username, body.password, body.token);
        res.status(result.status).json(result.body);
    } catch (error) {

        res.status(500);
    }
});

router.post('/login', notEmptyBody(['username', 'password']), async (req, res) => {
    try {
        const body = matchedData(req);
        const result = await authService.login(body.username, body.password);
        res.status(result.status).json(result.body);
    } catch (error) {
        res.status(500);
    }
});

module.exports = router;