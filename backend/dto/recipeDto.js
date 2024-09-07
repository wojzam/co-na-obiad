const {MAX_COMMENTS} = require('../constants/limits');

const recipeDtoSmall = (recipe) => {
    const formatIngredients = (ingredients) => ingredients.map(ingredient => ingredient.name.toLowerCase()).join(', ');

    const [ingredients, additionalIngredients] = recipe.ingredientSections.reduce(([main, additional], section, index) => {
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
        categories: recipe.categories,
        ingredients: formatIngredients(ingredients),
        additionalIngredients: formatIngredients(additionalIngredients),
        creator: recipe.creator.name,
        comments: recipe.comments ? recipe.comments.length : 0
    };
};

const recipeDto = (recipe, userId) => {
    const recipeObj = recipe.toObject();

    if (userId) {
        recipeObj.saved = !!(recipeObj.savedBy && recipeObj.savedBy.some((id) => id.equals(userId)));
        recipeObj.canEdit = recipeObj.creator && userId.equals(recipeObj.creator._id);
    }

    recipeObj.comments?.map((comment) => {
        comment.creator = comment.user.name;
        comment.canDelete = userId && ((recipeObj.creator && userId.equals(recipeObj.creator._id)) || comment.user._id.equals(userId));
        comment.user = undefined;
        comment.createdAt = comment.createdAt.toLocaleString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        })
    })

    if (recipeObj.creator) recipeObj.creator = recipeObj.creator.name;
    recipeObj.canComment = userId !== undefined && (!recipeObj.comments || recipeObj.comments.length < MAX_COMMENTS);
    recipeObj.savedBy = undefined;

    recipeObj.comments = createCommentsHierarchy(recipeObj.comments);

    return recipeObj;
}

const createCommentsHierarchy = (comments) => {
    const commentMap = new Map();
    const result = [];

    const getFromMap = (_id) => {
        const comment = commentMap.get(_id.toString())
        if (comment) return comment;
        const deletedComment = {_id: _id, text: "Usunięto", parentId: null, children: []};
        commentMap.set(_id.toString(), deletedComment);
        result.push(deletedComment);
        return deletedComment;
    }

    comments.forEach(comment => {
        comment.children = [];
        commentMap.set(comment._id.toString(), comment);

    });

    comments.forEach(comment => {
        if (comment.parentId === null) {
            result.push(comment);

        } else {
            let depth = 1;
            let parentComment = getFromMap(comment.parentId);

            while (parentComment && parentComment.parentId !== null) {
                depth++;
                parentComment = getFromMap(parentComment.parentId);
            }

            if (depth >= 2) {
                let ancestor = getFromMap(comment.parentId);
                while (ancestor && depth >= 3) {
                    ancestor = getFromMap(ancestor.parentId);
                    depth--;
                }
                if (ancestor) {
                    ancestor.children.push(comment);
                }
            } else {
                parentComment.children.push(comment);
            }
        }
    });

    return result;
}

module.exports = {recipeDtoSmall, recipeDto};
