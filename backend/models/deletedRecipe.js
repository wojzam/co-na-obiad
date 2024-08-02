const mongoose = require('mongoose');
const Recipe = require('./recipe');

const deletedRecipeSchema = new mongoose.Schema({
    recipe: {type: Recipe.schema, required: true},
    deleted_at: {type: Date, default: Date.now}
}, {collection: "deletedRecipes", versionKey: false});

module.exports = mongoose.model('DeletedRecipe', deletedRecipeSchema);
