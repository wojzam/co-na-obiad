const Recipe = require("../models/recipe");
const recipeDto = require("../dto/recipeDto");
const DishCategory = require("../models/dishCategory");
const Ingredient = require("../models/ingredient");
const DeletedRecipe = require("../models/deletedRecipe");

const OK = (body = {message: "OK"}) => {
    return {status: 200, body: body}
};
const CREATED = (body) => {
    return {status: 201, body: body}
};
const ACCESS_DENIED = {status: 403, body: {message: 'Access denied'}};
const NOT_FOUND = {status: 404, body: {message: 'Recipe not found'}};

const list = async (name, include, exclude, creatorId, sort) => {
    const includeIds = include ? include.split(",") : [];
    const excludeIds = exclude ? exclude.split(",") : [];

    let query = name ? [{name: {$regex: name, $options: 'i'}}] : [];

    if (creatorId) {
        query.push({creatorId: creatorId})
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
    const sortQuery = sort === 'date' ? {createdAt: -1} : {name: 1};

    const recipes = await Recipe
        .find(findQuery)
        .collation({locale: 'en', strength: 2})
        .sort(sortQuery);

    return OK(recipes?.map(recipe => recipeDto(recipe)));
}

const find = async (id) => {
    const recipe = await Recipe.findById(id);
    if (!recipe) return NOT_FOUND;
    return OK(recipe);
}

const create = async (name, category, comment, ingredients, userId) => {
    const newRecipe = new Recipe({
        name: name,
        comment: comment,
        category: await validateCategory(category),
        ingredientSections: [{
            _id: 1, sectionName: "", optional: false, ingredients: await validateIngredients(ingredients)
        }],
        creatorId: userId
    });

    return CREATED(await newRecipe.save());
}

const update = async (id, name, category, comment, ingredients, userId) => {
    const recipe = await Recipe.findById(id);
    if (!recipe) return NOT_FOUND;
    if (!recipe.creatorId.equals(userId)) ACCESS_DENIED;

    recipe.name = name;
    recipe.comment = comment;
    recipe.category = await validateCategory(category);
    recipe.ingredientSections[0] = {
        _id: 1, sectionName: "", optional: false, ingredients: await validateIngredients(ingredients)
    };
    recipe.updatedAt = Date.now();

    return OK(await recipe.save());
}

const softDelete = async (recipeId, userId) => {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return NOT_FOUND
    if (!recipe.creatorId.equals(userId)) return ACCESS_DENIED;

    const deletedRecipe = new DeletedRecipe({recipe: recipe});
    await deletedRecipe.save();

    await Recipe.findByIdAndDelete(recipe._id);
    return OK();
}

const listCategories = async () => {
    return OK(await DishCategory.find());
}

const validateCategory = async (category) => {
    return await DishCategory.find({name: category}).then(c => c[0]);
};

const validateIngredients = async (ingredients) => {
    const ingredientNames = [...new Set(ingredients.map(ing => ing.name))];
    const validIngredients = await Ingredient.find({name: {$in: ingredientNames}});
    const validIngredientsMap = new Map(validIngredients.map(ing => [ing.name, ing]));

    return ingredients.reduce((acc, ing) => {
        const validIng = validIngredientsMap.get(ing.name);
        if (validIng) {
            acc.push({
                _id: validIng._id,
                name: validIng.name,
                value: ing.value,
                unit: ing.unit
            });
        }
        return acc;
    }, []);
};

module.exports = {
    list,
    find,
    create,
    update,
    softDelete,
    listCategories,
}