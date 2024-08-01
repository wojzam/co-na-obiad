const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    name: {type: String, required: true},
});

ingredientSchema.index({name: 1});

module.exports = mongoose.model('Ingredient', ingredientSchema);
