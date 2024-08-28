const express = require('express');
const router = express.Router();
const recipesService = require('../services/recipesService');
const {matchedData, validationResult} = require('express-validator');
const {filterSchema, recipeSchema, commentSchema} = require('../middlewares/validation/recipeValidation')
const {requireToken, optionalToken} = require('../middlewares/authMiddleware');
const {validId} = require("../middlewares/validation/validId");

router.get('/', filterSchema, async (req, res) => {
    try {
        const data = matchedData(req);
        const result = await recipesService.list(
            data.name,
            data.include,
            data.exclude,
            data.categories,
            data.creatorId,
            data.savedBy,
            data.sort,
            data.page,
            data.pageSize
        );
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.post('/', requireToken, recipeSchema, async (req, res) => {
    try {
        const data = matchedData(req);
        const result = await recipesService.create(data.name, data.categories, data.preparation, data.ingredientSections, req.user);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.get('/can-create', requireToken, async (req, res) => {
    try {
        const result = await recipesService.canCreate(req.userId);
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

router.get('/:id', validId(), optionalToken, async (req, res) => {
    try {
        const result = await recipesService.find(req.params.id, req.userId);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.put('/:id', requireToken, validId(), recipeSchema, async (req, res) => {
    try {
        const data = matchedData(req);
        const result = await recipesService.update(req.params.id, data.name, data.categories, data.preparation, data.ingredientSections, req.userId);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.delete('/:id', requireToken, validId(), async (req, res) => {
    try {
        const result = await recipesService.softDelete(req.params.id, req.userId);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.post('/:id/save', requireToken, validId(), async (req, res) => {
    try {
        const result = await recipesService.save(req.params.id, req.userId);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.delete('/:id/save', requireToken, validId(), async (req, res) => {
    try {
        const result = await recipesService.unSave(req.params.id, req.userId);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.post('/:id/comments', requireToken, validId(), commentSchema, async (req, res) => {
    try {
        const data = matchedData(req);
        const result = await recipesService.comment(req.params.id, req.user, data.text);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

router.delete('/:id/comments/:commentId', requireToken, validId(), validId('commentId'), async (req, res) => {
    try {
        const result = await recipesService.deleteComment(req.params.id, req.params.commentId, req.userId);
        res.status(result.status).json(result.body);
    } catch (err) {
        res.status(500);
    }
});

module.exports = router;
