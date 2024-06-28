const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    name: {type: String, required: true},
    type: {
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'IngredientType', required: true},
        name: {type: String, required: true}
    },
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
