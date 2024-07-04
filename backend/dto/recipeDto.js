const recipeDto = (recipe) => {
    const formatIngredients = (ingredients) =>
        ingredients.map(ingredient => ingredient.name.toLowerCase()).join(', ');

    const ingredients = recipe.ingredientSections.reduce((acc, section) => {
        if (section.optional) {
            acc.optionalIngredients.push(...section.ingredients);
        } else {
            acc.requiredIngredients.push(...section.ingredients);
        }
        return acc;
    }, {requiredIngredients: [], optionalIngredients: []});

    return {
        id: recipe._id,
        name: recipe.name,
        ingredients: formatIngredients(ingredients.requiredIngredients),
        optional: formatIngredients(ingredients.optionalIngredients),
    };
};

module.exports = recipeDto;
