const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: {type: String, required: true, index: true, unique: true},
    children: [{
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true},
    }]
}, {
    versionKey: false
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
