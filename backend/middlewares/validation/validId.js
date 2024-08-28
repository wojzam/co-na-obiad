const {check} = require('express-validator');
const mongoose = require('mongoose');
const {validRequest} = require('./validRequest');

const validId = (paramName = 'id') => [
    check(paramName).custom((value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error(`Invalid ${paramName} format`);
        }
        return true;
    }),
    validRequest
];

module.exports = {validId};
