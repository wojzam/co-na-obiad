const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    name: { type: String, required: true },
});

module.exports = mongoose.model('Unit', unitSchema);
