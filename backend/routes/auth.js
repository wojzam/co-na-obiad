const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const {matchedData, body} = require('express-validator');
const {authSchema} = require("../middlewares/validation/authValidation");

router.post('/register', authSchema, async (req, res) => {
    try {
        const body = matchedData(req);
        const result = await authService.register(body.username, body.password, body.token);
        res.status(result.status).json(result.body);
    } catch (error) {
        res.status(500);
    }
});

router.post('/login', authSchema, async (req, res) => {
    try {
        const body = matchedData(req);
        const result = await authService.login(body.username, body.password, body.token);
        res.status(result.status).json(result.body);
    } catch (error) {
        res.status(500);
    }
});

module.exports = router;