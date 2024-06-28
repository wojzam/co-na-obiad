const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    ingredients: [{
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true},
        name: {type: String, required: true},
        count: {type: Number},
        unit: {type: String}
    }],
    optional: [{
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true},
        name: {type: String, required: true},
        count: {type: Number},
        unit: {type: String}
    }],
    comment: {type: String, default: ""},
    creator_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    created_at: {type: Date, default: Date.now},
});

recipeSchema.index({name: 1});
recipeSchema.index({created_at: 1});

module.exports = mongoose.model('Recipe', recipeSchema);
