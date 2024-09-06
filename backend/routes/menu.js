const express = require('express');
const router = express.Router();
const menuService = require('../services/menuService');
const {matchedData} = require("express-validator");
const {getSchema} = require("../middlewares/validation/menuValidation");

router.get('/random', getSchema, async (req, res) => {
    try {
        const data = matchedData(req);
        const result = await menuService.random(data.count, data.category);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

module.exports = router;