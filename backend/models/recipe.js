const mongoose = require('mongoose');

const ingredientsSectionSchema = new mongoose.Schema({
    _id: {type: Number, required: true},
    sectionName: {type: String, default: ""},
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
    creatorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
}, {
    versionKey: false
});

recipeSchema.index({name: 1}, {collation: {locale: 'en', strength: 2}});
recipeSchema.index({createdAt: 1});

module.exports = mongoose.model('Recipe', recipeSchema);
