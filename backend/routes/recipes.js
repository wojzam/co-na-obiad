const express = require('express');
const {query, body, matchedData, validationResult} = require('express-validator');
const {requireToken, optionalToken} = require('../middlewares/authMiddleware');
const router = express.Router();
const recipesService = require('../services/recipesService');

router.get('/', optionalToken, query(['name', 'include', 'exclude', 'sort']).escape(), async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).json({message: result.array()});
    const data = matchedData(req);

    try {
        const result = await recipesService.list(data.name, data.include, data.exclude, req.userId, data.sort);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.post('/', requireToken, body(['name', 'category']).trim().notEmpty().escape(), body(['comment']).trim().escape(), body('ingredients').isArray(), async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).json({message: result.array()});
    const data = matchedData(req);

    try {
        const result = await recipesService.create(data.name, data.category, data.comment, data.ingredients, req.userId);
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

router.get('/ingredients', async (req, res) => {
    try {
        const result = await recipesService.listIngredients();
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.get('/units', async (req, res) => {
    try {
        const result = await recipesService.listUnits();
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await recipesService.find(req.params.id);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.put('/:id', requireToken, body(['name', 'category']).trim().notEmpty().escape(), body(['comment']).trim().escape(), body('ingredients').isArray(), async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).json({message: result.array()});
    const data = matchedData(req);

    try {
        const result = await recipesService.update(req.params.id, data.name, data.category, data.comment, data.ingredients, req.userId);
        res.status(result.status).json(result.body);
    } catch (err) {
        console.log(err)
        res.status(500);
    }
});

router.delete('/:id', requireToken, async (req, res) => {
    try {
        const result = await recipesService.softDelete(req.params.id, req.userId);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

module.exports = router;
