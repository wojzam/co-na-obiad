const recipeDtoSmall = (recipe) => {
    const formatIngredients = (ingredients) => ingredients.map(ingredient => ingredient.name.toLowerCase()).join(', ');

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
        comments: recipe.comments ? recipe.comments.length : 0
    };
};

const recipeDto = (recipe, userId, maxComments = 100) => {
    const recipeObj = recipe.toObject();

    if (userId) {
        recipeObj.saved = !!(recipeObj.savedBy && recipeObj.savedBy.some((id) => id.equals(userId)));
        recipeObj.canEdit = recipeObj.creator && userId.equals(recipeObj.creator._id);
    }

    recipeObj.comments?.map((comment) => {
        comment.creator = comment.user.name;
        comment.user = undefined;
        comment.createdAt = comment.createdAt.toLocaleString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        })
    })

    if (recipeObj.creator) recipeObj.creator = recipeObj.creator.name;
    recipeObj.canComment = userId !== undefined && (!('comments' in recipeObj) || recipeObj.comments?.length < maxComments);
    recipeObj.savedBy = undefined;

    return recipeObj;
}

module.exports = {recipeDtoSmall, recipeDto};
