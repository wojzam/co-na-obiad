const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId},
    name: {type: String, required: true},
    password: {type: String, required: true},
    favourite: {type: [String], default: []},
});

module.exports = mongoose.model('User', userSchema);