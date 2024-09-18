const Recipe = require("../models/recipe");
const {recipeDtoSmall} = require("../dto/recipeDto");

const OK = (body = {message: "OK"}) => {
    return {status: 200, body: body};
};

const random = async (count, category) => {
    const recipes = await Recipe
        .aggregate([
            {$match: {'categories.name': category}},
            {$sample: {size: count}}
        ]);

    return OK(recipes?.map(recipe => recipeDtoSmall(recipe)));
}

module.exports = {
    random,
}