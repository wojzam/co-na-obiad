const {checkSchema} = require("express-validator");
const {validRequest} = require("./validRequest");

const getSchema = [checkSchema({
    count: {
        in: ['query'], trim: true, escape: true, isInt: {
            options: {min: 1, max: 7}, errorMessage: 'Count must be a number between 1-7'
        }, toInt: true,
    }, category: {
        in: ['query'], trim: true, escape: true, isLength: {
            options: {max: 20}, errorMessage: 'Category cannot exceed 20 characters',
        },
    },
}), validRequest];

const shoppingListSchema = [checkSchema({
    recipes: {
        optional: true, in: ['query'], isArray: {
            options: {max: 7}, errorMessage: 'Recipes must be an array with maximum of 7 items',
        }
    },
    'recipes.*': {
        optional: true, in: ['query'], trim: true, escape: true, isLength: {
            options: {max: 24}, errorMessage: 'Recipe ID cannot exceed 24 characters'
        },
    },
}), validRequest];

module.exports = {
    getSchema,
    shoppingListSchema,
};