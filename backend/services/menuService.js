const Recipe = require("../models/recipe");
const {recipeDto} = require("../dto/recipeDto");

const DEFAULT_UNIT = "szt.";
const DEFAULT_VALUE = 1;
const OK = (body = {message: "OK"}) => {
    return {status: 200, body: body};
};

const random = async (count, category) => {
    const recipes = await Recipe
        .aggregate([
            {$match: {'categories.name': category}},
            {$sample: {size: count}}
        ]);

    const response = {
        recipes: recipes?.map(recipe => recipeDto(recipe, null, true)),
        shoppingList: aggregateIngredients(recipes)
    }

    return OK(response);
}

const parseValue = (value) => {
    if (!value) return 1;
    if (typeof value === 'number') return value;
    if (value.includes('-')) {
        // Handle range like "1-2"
        return value.split('-').map(parseFloat)[1];
    } else if (value.includes(' ')) {
        // Handle mixed fraction like "1 1/2"
        const [whole, fraction] = value.split(' ');
        if (fraction) {
            const [numerator, denominator] = fraction.split('/').map(parseFloat);
            return parseFloat(whole) + numerator / denominator;
        }
        return parseFloat(whole);
    } else if (value.includes('/')) {
        // Handle simple fraction like "1/2"
        const [numerator, denominator] = value.split('/').map(parseFloat);
        return numerator / denominator;
    } else {
        // Handle decimal like "1.5"
        return parseFloat(value);
    }
}

const aggregateIngredients = (recipes) => {
    const ingredientMap = {};

    recipes.forEach(recipe => {
        recipe.ingredientSections.forEach(section => {
            section.ingredients.forEach(ingredient => {
                if (!ingredient.unit) ingredient.unit = DEFAULT_UNIT;
                if (!ingredient.value) ingredient.value = DEFAULT_VALUE;

                const key = `${ingredient.name}-${ingredient.unit}`;
                if (!ingredientMap[key]) {
                    ingredientMap[key] = {
                        _id: ingredient._id,
                        name: ingredient.name,
                        unit: ingredient.unit,
                        value: parseValue(ingredient.value),
                        type: ""
                    };
                } else {
                    ingredientMap[key].value += parseValue(ingredient.value);
                }
            });
        });
    });

    return Object.values(ingredientMap)
        .map(ingredient => {
            ingredient.value = parseFloat(ingredient.value.toFixed(2)).toString();
            if (ingredient.unit === DEFAULT_UNIT && ingredient.value === DEFAULT_VALUE.toString()) {
                ingredient.unit = "";
                ingredient.value = "";
            }
            return {...ingredient};
        })
        .sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = {
    random
}