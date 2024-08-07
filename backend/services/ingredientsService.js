const Ingredient = require("../models/ingredient");
const Unit = require("../models/unit");
const Recipe = require("../models/recipe");

const duplicateErrorCode = 11000;
const OK = (body = {message: "OK"}) => {
    return {status: 200, body: body}
};
const CREATED = (body) => {
    return {status: 201, body: body}
};
const NOT_FOUND = {status: 404, body: {message: 'Ingredient not found'}};
const INGREDIENT_CONFLICT = {status: 409, body: {message: 'Ingredient with provided name already exists'}};


const list = async () => {
    return OK(await Ingredient.find().sort({name: 1}));
}

const listUnits = async () => {
    return OK(await Unit.find());
}

const create = async (name) => {
    try {
        const newIngredient = new Ingredient({
            name: name
        });
        return CREATED(await newIngredient.save());
    } catch (error) {
        if (error.code === duplicateErrorCode) return INGREDIENT_CONFLICT;
        throw error;
    }
}

const update = async (id, name) => {
    try {
        const ingredient = await Ingredient.findById(id);
        if (!ingredient) return NOT_FOUND;

        ingredient.name = name;

        const updatedIngredient = await ingredient.save();
        await updateIngredientNameInRecipes(id, name);

        return OK(updatedIngredient);
    } catch (error) {
        if (error.code === duplicateErrorCode) return INGREDIENT_CONFLICT;
        throw error;
    }
}

const updateIngredientNameInRecipes = async (id, name) => {
    await Recipe.updateMany(
        {'ingredientSections.ingredients._id': id},
        {$set: {'ingredientSections.$[section].ingredients.$[ingredient].name': name}},
        {
            arrayFilters: [
                {'section.ingredients._id': id},
                {'ingredient._id': id}
            ]
        }
    );
};

module.exports = {
    list,
    listUnits,
    create,
    update,
}