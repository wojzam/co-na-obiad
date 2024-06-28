const mongoose = require('mongoose');

const dishCategorySchema = new mongoose.Schema({
    _id: {type: Number},
    name: {type: String, required: true},
}, {collection: "dishCategories"});

module.exports = mongoose.model('DishCategory', dishCategorySchema);
