const express = require('express');
const {query, body, matchedData, validationResult} = require('express-validator');
const {requireToken, optionalToken} = require('../middlewares/authMiddleware');
const router = express.Router();
const Recipe = require('../models/recipe');
const DeletedRecipe = require('../models/deletedRecipe');
const recipeDto = require('../dto/recipeDto');
const Ingredient = require('../models/ingredient');
const Unit = require('../models/unit');
const DishCategory = require('../models/dishCategory');

router.get('/', optionalToken, query(['name', 'include', 'exclude', 'sort']).escape(), async (req, res) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({message: result.array()});
        }

        const data = matchedData(req);
        const includeIds = data.include ? data.include.split(",") : [];
        const excludeIds = data.exclude ? data.exclude.split(",") : [];

        let query = data.name ? [{name: {$regex: data.name, $options: 'i'}}] : [];

        if (req.userId) {
            query.push({creator_id: req.userId})
        }

        if (includeIds.length > 0) {
            query.push({
                $or: [
                    {'ingredientSections.ingredients._id': {$in: includeIds}}
                ]
            });
        }

        if (excludeIds.length > 0) {
            query.push({
                $and: [
                    {'ingredientSections.ingredients._id': {$nin: excludeIds}}
                ]
            });
        }

        const findQuery = query.length > 0 ? {$and: query} : {};
        const sortQuery = data.sort === 'date' ? {created_at: -1} : {name: 1};

        const recipes = await Recipe.find(findQuery).sort(sortQuery);
        const recipesDto = recipes?.map(recipe => recipeDto(recipe));
        res.json(recipesDto);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post('/', requireToken, body(['name', 'comment', 'category']).trim().notEmpty().escape(), body('ingredients').isArray(), async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({message: result.array()});
    }
    const data = matchedData(req);

    const category = await DishCategory.find({name: data.category}).then(c => c[0]);

    const ingredients = await Ingredient.find({name: {$in: data.ingredients.map(ing => ing.name)}});
    const mappedIngredients = data.ingredients.map(recipeIngredient => {
        const ingredient = ingredients.find(ing => ing.name === recipeIngredient.name);
        return {
            _id: ingredient._id,
            name: ingredient.name,
            value: recipeIngredient.value,
            unit: recipeIngredient.unit
        };
    });

    const newRecipe = new Recipe({
        name: data.name,
        comment: data.comment,
        category: category,
        ingredientSections: [{
            _id: 1,
            section_name: "",
            optional: false,
            ingredients: mappedIngredients
        }],
        creator_id: req.userId
    });

    try {
        const savedRecipe = await newRecipe.save();
        res.status(201).json(savedRecipe);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

router.get('/categories', async (req, res) => {
    try {
        let dishCategories = await DishCategory.find();
        res.json(dishCategories);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/ingredients', async (req, res) => {
    try {
        let ingredients = await Ingredient.find().sort({name: 1});
        res.json(ingredients);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/units', async (req, res) => {
    try {
        let units = await Unit.find();
        res.json(units);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({message: 'Recipe not found'});
        res.json(recipe);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.put('/:id', requireToken, body(['name', 'comment', 'category']).trim().notEmpty().escape(), body('ingredients').isArray(), async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({message: result.array()});
    }
    const data = matchedData(req);

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({message: 'Recipe not found'});
    if (recipe.creator_id.toString() !== req.userId) return res.status(403).json({message: 'Access denied'});

    const category = await DishCategory.find({name: data.category}).then(c => c[0]);

    const ingredients = await Ingredient.find({name: {$in: data.ingredients.map(ing => ing.name)}});
    const mappedIngredients = data.ingredients.map(recipeIngredient => {
        const ingredient = ingredients.find(ing => ing.name === recipeIngredient.name);
        return {
            _id: ingredient._id,
            name: ingredient.name,
            value: recipeIngredient.value,
            unit: recipeIngredient.unit
        };
    });

    recipe.name = data.name;
    recipe.comment = data.comment;
    recipe.category = category;
    recipe.ingredientSections[0] = {
        _id: 1,
        section_name: "",
        optional: false,
        ingredients: mappedIngredients
    };
    recipe.updated_at = Date.now();

    try {
        await recipe.save();
        res.status(200).json(recipe);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

router.delete('/:id', requireToken, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({message: 'Recipe not found'});
        if (recipe.creator_id.toString() !== req.userId) return res.status(403).json({message: 'Access denied'});

        const deletedRecipe = new DeletedRecipe({recipe: recipe});
        await deletedRecipe.save();

        await Recipe.findByIdAndDelete(recipe._id);
        res.status(200).json({message: 'Recipe deleted'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;
