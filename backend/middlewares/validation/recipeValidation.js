const {checkSchema} = require("express-validator");
const {validRequest} = require("./validRequest");

const filterSchema = [checkSchema({
    name: {
        optional: true,
        in: ['query'],
        trim: true,
        escape: true,
        isLength: {
            options: {max: 100},
            errorMessage: 'Name cannot exceed 100 characters'
        },
    },
    include: {
        optional: true,
        in: ['query'],
        trim: true,
        escape: true,
        isLength: {
            options: {max: 25000},
            errorMessage: 'Include cannot exceed 25000 characters'
        },
    },
    exclude: {
        optional: true,
        in: ['query'],
        trim: true,
        escape: true,
        isLength: {
            options: {max: 25000},
            errorMessage: 'Exclude cannot exceed 25000 characters'
        },
    },
    creatorId: {
        optional: true,
        in: ['query'],
        trim: true,
        escape: true,
        isLength: {
            options: {max: 24},
            errorMessage: 'Creator ID cannot exceed 24 characters'
        },
    },
    sort: {
        optional: true,
        in: ['query'],
        trim: true,
        escape: true,
        isLength: {
            options: {max: 20},
            errorMessage: 'Sort cannot exceed 20 characters'
        },
    },
}), validRequest];

const recipeSchema = [checkSchema({
    name: {
        notEmpty: {
            errorMessage: 'Name is required',
        },
        in: ['body'],
        trim: true,
        escape: true,
        isLength: {
            options: {max: 100},
            errorMessage: 'Name cannot exceed 100 characters',
        },
    },
    category: {
        notEmpty: {
            errorMessage: 'Category is required',
        },
        in: ['body'],
        trim: true,
        escape: true,
        isLength: {
            options: {max: 50},
            errorMessage: 'Category cannot exceed 50 characters',
        },
    },
    comment: {
        optional: true,
        in: ['body'],
        trim: true,
        customSanitizer: {
            options: (value) => customEscape(value),
        },
        isLength: {
            options: {max: 10000},
            errorMessage: 'Comment cannot exceed 10000 characters',
        },
    },
    ingredients: {
        in: ['body'],
        isArray: {
            options: {max: 100},
            errorMessage: 'Ingredients must be an array with maximum of 100 items',
        }
    },
    'ingredients.*': {
        in: ['body'],
        isLength: {
            options: {max: 255},
            errorMessage: 'Each ingredient cannot exceed 255 characters',
        }
    },
}), validRequest];

const customEscape = (value) => {
    if (typeof value !== 'string') return value;
    return value
        .replace(/&/g, '&amp;')  // Escape '&'
        .replace(/</g, '&lt;')   // Escape '<'
        .replace(/>/g, '&gt;')   // Escape '>'
};

module.exports = {
    filterSchema,
    recipeSchema
};