const mongoose = require('mongoose');

const ingredientsSectionSchema = new mongoose.Schema({
    _id: {type: Number, required: true},
    sectionName: {type: String, default: ""},
    ingredients: [{
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true, index: true},
        name: {type: String, required: true},
        value: {type: String},
        unit: {type: String},
        type: {type: String}
    }]
});

const commentSchema = new mongoose.Schema({
    user: {
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        name: {type: String, required: true},
    },
    text: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    parentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null},
});

const recipeSchema = new mongoose.Schema({
    name: {type: String, required: true, index: {collation: {locale: 'pl', strength: 1}}},
    preparation: {type: String, default: ""},
    categories: [{
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'DishCategory', required: true},
        name: {type: String, required: true, index: true},
    }],
    ingredientSections: [ingredientsSectionSchema],
    creator: {
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true},
        name: {type: String, required: true},
    },
    savedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true}],
    comments: [commentSchema],
    createdAt: {type: Date, default: Date.now, index: true},
    updatedAt: {type: Date, default: Date.now},
}, {
    versionKey: false
});

module.exports = mongoose.model('Recipe', recipeSchema);
