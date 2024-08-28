const express = require('express');
const router = express.Router();
const ingredientsService = require('../services/ingredientsService');
const {requireToken, requireAdmin} = require("../middlewares/authMiddleware");
const {ingredientSchema} = require("../middlewares/validation/ingredientValidation");
const {matchedData} = require("express-validator");
const {validId} = require("../middlewares/validation/validId");


router.get('/', async (req, res) => {
    try {
        const result = await ingredientsService.list();
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.post('/', requireToken, requireAdmin, ingredientSchema, async (req, res) => {
    try {
        const data = matchedData(req);
        const result = await ingredientsService.create(data.name);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.get('/units', async (req, res) => {
    try {
        const result = await ingredientsService.listUnits();
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.put('/:id', requireToken, requireAdmin, validId(), ingredientSchema, async (req, res) => {
    try {
        const data = matchedData(req);
        const result = await ingredientsService.update(req.params.id, data.name, data.children);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

module.exports = router;