const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true, index: {collation: {locale: 'pl', strength: 1}}},
    children: [{
        _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true},
    }]
}, {
    versionKey: false
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
