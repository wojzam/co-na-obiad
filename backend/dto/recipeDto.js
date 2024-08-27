const recipeDto = (recipe) => {
    const formatIngredients = (ingredients) =>
        ingredients.map(ingredient => ingredient.name.toLowerCase()).join(', ');

    const [ingredients, additionalIngredients] = recipe.ingredientSections.reduce(
        ([main, additional], section, index) => {
            if (index === 0) {
                main.push(...section.ingredients);
            } else {
                additional.push(...section.ingredients);
            }
            return [main, additional];
        }, [[], []]);

    return {
        id: recipe._id,
        name: recipe.name,
        categories: recipe.categories.map(c => c.name).join(", "),
        ingredients: formatIngredients(ingredients),
        additionalIngredients: formatIngredients(additionalIngredients),
        creator: recipe.creator.name,
    };
};

module.exports = recipeDto;
