const recipeDto = (recipe) => {
    const formatIngredients = (ingredients) => {
        return ingredients.map(ingredient => ingredient.name.toLowerCase()).join(', ');
    };

    return {
        id: recipe._id,
        name: recipe.name,
        ingredients: formatIngredients(recipe.ingredients),
        optional: formatIngredients(recipe.optional),
    };
};

module.exports = recipeDto;