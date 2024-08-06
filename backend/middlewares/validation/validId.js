const {check, validationResult} = require('express-validator');
const mongoose = require('mongoose');
const {validRequest} = require("./validRequest");

const validId = [
    check('id').custom((value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid ID format');
        }
        return true;
    }), validRequest
];

module.exports = {validId};
