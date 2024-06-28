const mongoose = require('mongoose');

const ingredientTypeSchema = new mongoose.Schema({
            _id: {type: Number, required: true},
            name: {type: String, required: true},
        }, {collection: "ingredientTypes"});

module.exports = mongoose.model('IngredientType', ingredientTypeSchema);
