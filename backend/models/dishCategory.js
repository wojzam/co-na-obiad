const mongoose = require('mongoose');

const dishCategorySchema = new mongoose.Schema({
    name: {type: String, required: true},
}, {versionKey: false, collection: "dishCategories"});

module.exports = mongoose.model('DishCategory', dishCategorySchema);
