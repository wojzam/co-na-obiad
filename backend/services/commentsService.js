const Recipe = require("../models/recipe");
const {recipeDto} = require("../dto/recipeDto");

const {MAX_COMMENTS} = require('../constants/limits');

const RECIPE_NOT_FOUND = {status: 404, body: {message: 'Recipe not found'}};
const COMMENT_NOT_FOUND = {status: 404, body: "Comment not found"};
const EXCEEDED_COMMENTS_LIMIT = {status: 429, body: {message: 'Exceeded limit of added comments'}};
const FORBIDDEN = {status: 403, body: "You are not authorized to delete this comment"};
const OK = (body = {message: "OK"}) => {
    return {status: 200, body: body};
};

const comment = async (recipeId, user, text) => {
    const recipe = await Recipe.findById(recipeId).select('comments');
    if (!recipe) return RECIPE_NOT_FOUND;
    if (!Array.isArray(recipe.comments)) recipe.comments = [];
    if (recipe.comments.length >= MAX_COMMENTS) return EXCEEDED_COMMENTS_LIMIT;

    recipe.comments.push({
        user: {_id: user._id, name: user.username},
        text: text
    });

    const dto = recipeDto(await recipe.save(), user._id);
    return OK({comments: dto.comments, canComment: dto.canComment});
};

const deleteComment = async (recipeId, commentId, userId) => {
    const recipe = await Recipe.findById(recipeId).select(["comments", "creator"]);
    if (!recipe) return RECIPE_NOT_FOUND;

    if (!Array.isArray(recipe.comments) || recipe.comments.length === 0) return COMMENT_NOT_FOUND;

    const comment = recipe.comments.id(commentId);

    if (!comment) return COMMENT_NOT_FOUND;
    if (!recipe.creator._id.equals(userId) && !comment.user._id.equals(userId)) return FORBIDDEN;

    recipe.comments = recipe.comments.filter((c) => !c._id.equals(comment._id));

    const dto = recipeDto(await recipe.save(), userId);
    return OK({comments: dto.comments, canComment: dto.canComment});
}

module.exports = {comment, deleteComment, MAX_COMMENTS};