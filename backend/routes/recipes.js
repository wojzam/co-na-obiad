const express = require('express');
const {query, body, matchedData, validationResult} = require('express-validator');
const router = express.Router();
const Recipe = require('../models/recipe');
const recipeDto = require('../dto/recipeDto');
const Ingredient = require('../models/ingredient');
const IngredientType = require('../models/ingredientType');
const Unit = require('../models/unit');
const DishCategory = require('../models/dishCategory');

router.get('/', query(['name', 'include', 'exclude', 'sort']).escape(), async (req, res) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({message: result.array()});
        }

        const data = matchedData(req);
        const includeIds = data.include ? data.include.split(",") : [];
        const excludeIds = data.exclude ? data.exclude.split(",") : [];

        let query = data.name ? [{name: {$regex: data.name, $options: 'i'}}] : [];

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
        const recipesDto = recipes.map(recipe => recipeDto(recipe));
        res.json(recipesDto);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});


router.post('/', async (req, res) => {
    const {name, ingredients, instructions} = req.body;

    // const newRecipe = new Recipe({
    //     name,
    //     ingredients: ingredients.split(',').map(item => item.trim()),
    //     instructions,
    // });

    try {
        // const savedRecipe = await newRecipe.save();
        // res.redirect(`/recipes/${savedRecipe._id}`);
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

// router.get('/:id/edit', async (req, res) => {
//     try {
//         const recipe = await Recipe.findById(req.params.id);
//         if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
//         res.render('recipes/edit', { recipe });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
//
// router.put('/:id', async (req, res) => {
//     const { name, ingredients, instructions } = req.body;
//
//     try {
//         const updatedRecipe = await Recipe.findByIdAndUpdate(
//             req.params.id,
//             { name, ingredients: ingredients.split(',').map(item => item.trim()), instructions },
//             { new: true }
//         );
//         if (!updatedRecipe) return res.status(404).json({ message: 'Recipe not found' });
//         res.redirect(`/recipes/${updatedRecipe._id}`);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });
//
// // Delete a recipes by ID
// router.delete('/:id', async (req, res) => {
//     try {
//         const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
//         if (!deletedRecipe) return res.status(404).json({ message: 'Recipe not found' });
//         res.redirect('/recipes');
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

module.exports = router;
