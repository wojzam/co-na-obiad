const {checkSchema} = require("express-validator");
const {validRequest} = require("./validRequest");

const ingredientSchema = [checkSchema({
    name: {
        notEmpty: {
            errorMessage: 'Name is required',
        },
        in: ['body'],
        trim: true,
        escape: true,
        isLength: {
            options: {max: 64},
            errorMessage: 'Name cannot exceed 64 characters',
        },
    }
}), validRequest];

module.exports = {ingredientSchema};