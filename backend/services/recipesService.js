const Recipe = require("../models/recipe");
const DeletedRecipe = require("../models/deletedRecipe");
const DishCategory = require("../models/dishCategory");
const Ingredient = require("../models/ingredient");
const User = require("../models/user");
const recipeDto = require("../dto/recipeDto");

const OK = (body = {message: "OK"}) => {
    return {status: 200, body: body}
};
const CREATED = (body) => {
    return {status: 201, body: body}
};
const ACCESS_DENIED = {status: 403, body: {message: 'Access denied'}};
const NOT_FOUND = {status: 404, body: {message: 'Recipe not found'}};

const list = async (name, include, exclude, creatorId, sort) => {
    const includeIds = include ? include.map(i => i.split(",")) : [];
    const excludeIds = exclude ? exclude.map(i => i.split(",")) : [];

    let query = name ? [{name: {$regex: name, $options: 'i'}}] : [];

    if (creatorId) {
        query.push({creatorId: creatorId})
    }

    if (includeIds.length > 0) {
        query.push({
            $and: includeIds.map(children => ({
                'ingredientSections.ingredients._id': {$in: children}
            }))
        });
    }

    if (excludeIds.length > 0) {
        query.push({
            $and: excludeIds.map(children => ({
                'ingredientSections.ingredients._id': {$nin: children}
            }))
        });
    }

    const findQuery = query.length > 0 ? {$and: query} : {};
    let sortQuery;
    switch (sort) {
        case 'date_desc':
            sortQuery = {createdAt: -1};
            break;
        case 'date_asc':
            sortQuery = {createdAt: 1};
            break;
        default:
            sortQuery = {name: 1};
            break;
    }

    const recipes = await Recipe
        .find(findQuery)
        .collation({locale: 'en', strength: 2})
        .sort(sortQuery);

    return OK(recipes?.map(recipe => recipeDto(recipe)));
}

const find = async (id) => {
    const recipe = await Recipe.findById(id);
    if (!recipe) return NOT_FOUND;
    return OK(await appendCreatorUsername(recipe));
}

async function appendCreatorUsername(recipe) {
    const creator = await User.findById(recipe.creatorId).select('username');
    const recipeObj = recipe.toObject();

    recipeObj.creator = creator.username;
    recipeObj.creatorId = undefined;
    return recipeObj;
}

const create = async (name, categories, preparation, ingredientSections, userId) => {
    const newRecipe = new Recipe({
        name: name,
        preparation: preparation,
        categories: await validateCategories(categories),
        ingredientSections: await validateSections(ingredientSections),
        creatorId: userId
    });

    return CREATED(await newRecipe.save());
}

const update = async (id, name, categories, preparation, ingredientSections, userId) => {
    const recipe = await Recipe.findById(id);
    if (!recipe) return NOT_FOUND;
    if (!recipe.creatorId.equals(userId)) ACCESS_DENIED;

    recipe.name = name;
    recipe.preparation = preparation;
    recipe.categories = await validateCategories(categories);
    recipe.ingredientSections = await validateSections(ingredientSections);
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
    return OK(await DishCategory.find().sort({name: 1}));
}

const validateCategories = async (categoryNames) => {
    return await DishCategory.find({name: {$in: categoryNames}}).sort({name: 1});
};

function validateSections(ingredientSections) {
    return Promise.all(
        ingredientSections.map(async (section, index) => ({
            _id: index + 1,
            sectionName: section.sectionName,
            ingredients: await validateIngredients(section.ingredients),
        }))
    );
}

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