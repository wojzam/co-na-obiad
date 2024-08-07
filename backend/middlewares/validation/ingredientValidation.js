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
    },
    children: {
        optional: true,
        in: ['body'],
        isArray: {
            options: {max: 1000},
            errorMessage: 'Ingredients must be an array with maximum of 1000 items',
        }
    },
    'children.*': {
        in: ['body'],
        trim: true,
        escape: true,
        isLength: {
            options: {max: 30},
            errorMessage: 'Each ingredient cannot exceed 30 characters',
        }
    },
}), validRequest];

module.exports = {ingredientSchema};