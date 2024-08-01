const mongoose = require('mongoose');

const ingredientsSectionSchema = new mongoose.Schema({
    _id: {type: Number, required: true},
    section_name: {type: String, default: ""},
    optional: {type: Boolean, default: false},
    ingredients: [{
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true},
        name: {type: String, required: true},
        value: {type: Number},
        unit: {type: String}
    }]
});

const recipeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    comment: {type: String, default: ""},
    category: {
        _id: {type: Number, ref: 'DishCategory', required: true},
        name: {type: String, required: true},
    },
    ingredientSections: [ingredientsSectionSchema],
    creator_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
}, {
    versionKey: false
});

recipeSchema.index({name: 1});
recipeSchema.index({created_at: 1});

module.exports = mongoose.model('Recipe', recipeSchema);
