const express = require('express');
const router = express.Router();
const recipesService = require('../services/recipesService');
const {matchedData, validationResult} = require('express-validator');
const {filterSchema, recipeSchema} = require('../middlewares/validation/recipeValidation')
const {requireToken} = require('../middlewares/authMiddleware');
const {validId} = require("../middlewares/validation/validId");

router.get('/', filterSchema, async (req, res) => {
    try {
        const data = matchedData(req);
        const result = await recipesService.list(data.name, data.include, data.exclude, data.creatorId, data.sort, data.page, data.pageSize);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.post('/', requireToken, recipeSchema, async (req, res) => {
    try {
        const data = matchedData(req);
        const result = await recipesService.create(data.name, data.categories, data.preparation, data.ingredientSections, req.userId);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.get('/categories', async (req, res) => {
    try {
        const result = await recipesService.listCategories();
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.get('/:id', validId, async (req, res) => {
    try {
        const result = await recipesService.find(req.params.id);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.put('/:id', requireToken, validId, recipeSchema, async (req, res) => {
    try {
        const data = matchedData(req);
        const result = await recipesService.update(req.params.id, data.name, data.categories, data.preparation, data.ingredientSections, req.userId);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.delete('/:id', requireToken, validId, async (req, res) => {
    try {
        const result = await recipesService.softDelete(req.params.id, req.userId);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

module.exports = router;
