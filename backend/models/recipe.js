const mongoose = require('mongoose');

const ingredientsSectionSchema = new mongoose.Schema({
    _id: {type: Number, required: true},
    sectionName: {type: String, default: ""},
    ingredients: [{
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true},
        name: {type: String, required: true},
        value: {type: String},
        unit: {type: String}
    }]
});

const recipeSchema = new mongoose.Schema({
    name: {type: String, required: true, index: {collation: {locale: 'en', strength: 2}}},
    preparation: {type: String, default: ""},
    categories: [{
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'DishCategory', required: true},
        name: {type: String, required: true},
    }],
    ingredientSections: [ingredientsSectionSchema],
    creatorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: {type: Date, default: Date.now, index: true},
    updatedAt: {type: Date, default: Date.now},
}, {
    versionKey: false
});

module.exports = mongoose.model('Recipe', recipeSchema);
