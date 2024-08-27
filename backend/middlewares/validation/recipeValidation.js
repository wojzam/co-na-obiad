const {checkSchema} = require("express-validator");
const {validRequest} = require("./validRequest");

const filterSchema = [checkSchema({
    name: {
        optional: true, in: ['query'], trim: true, escape: true, isLength: {
            options: {max: 100}, errorMessage: 'Name cannot exceed 100 characters'
        },
    }, include: {
        optional: true, in: ['query'], isArray: {
            options: {max: 20}, errorMessage: 'Too large include array',
        }
    }, 'include.*': {
        trim: true, escape: true, isLength: {
            options: {max: 30}, errorMessage: 'Include item cannot exceed 30 characters',
        },
    }, exclude: {
        optional: true, in: ['query'], isArray: {
            options: {max: 20}, errorMessage: 'Too large exclude array',
        }
    }, 'exclude.*': {
        trim: true, escape: true, isLength: {
            options: {max: 30}, errorMessage: 'Exclude item cannot exceed 30 characters',
        },
    }, categories: {
        optional: true, in: ['query'], isArray: {
            options: {max: 10}, errorMessage: 'Categories must be an array with maximum of 10 items',
        }
    }, 'categories.*': {
        trim: true, escape: true, isLength: {
            options: {max: 20}, errorMessage: 'Category cannot exceed 20 characters',
        },
    }, creatorId: {
        optional: true, in: ['query'], trim: true, escape: true, isLength: {
            options: {max: 24}, errorMessage: 'Creator ID cannot exceed 24 characters'
        },
    }, savedBy: {
        optional: true, in: ['query'], trim: true, escape: true, isLength: {
            options: {max: 24}, errorMessage: 'SavedBy cannot exceed 24 characters'
        },
    }, sort: {
        optional: true, in: ['query'], trim: true, escape: true, isLength: {
            options: {max: 20}, errorMessage: 'Sort cannot exceed 20 characters'
        },
    }, page: {
        optional: true, in: ['query'], trim: true, escape: true, isInt: {
            options: {min: 1, max: 10000}, errorMessage: 'Page must be a number between 1-10000'
        }
    }, pageSize: {
        optional: true, in: ['query'], trim: true, escape: true, isInt: {
            options: {min: 1, max: 100}, errorMessage: 'Page size must be a number between 1-100'
        }
    },
}), validRequest];

const recipeSchema = [checkSchema({
    name: {
        notEmpty: {
            errorMessage: 'Name is required',
        }, in: ['body'], trim: true, escape: true, isLength: {
            options: {min: 3, max: 100}, errorMessage: 'Name must be between 3-100 characters',
        }, matches: {
            options: /^[a-zA-Z0-9 @\-!._:*#%?]+$/,
            errorMessage: 'Name can contain only letter, numbers or @-!._:*#%?'
        }
    }, categories: {
        optional: true, in: ['body'], isArray: {
            options: {max: 10}, errorMessage: 'Categories must be an array with maximum of 10 items',
        },
    }, 'categories.*': {
        notEmpty: {
            errorMessage: 'Category name is required',
        }, trim: true, escape: true, isLength: {
            options: {max: 50}, errorMessage: 'Category cannot exceed 50 characters',
        },
    }, preparation: {
        optional: true, in: ['body'], trim: true, customSanitizer: {
            options: (value) => customEscape(value),
        }, isLength: {
            options: {max: 10000}, errorMessage: 'Preparation cannot exceed 10000 characters',
        },
    }, ingredientSections: {
        in: ['body'], isArray: {
            options: {max: 5}, errorMessage: 'Ingredient section must be an array with maximum of 5 items',
        }
    }, 'ingredientSections.*.sectionName': {
        optional: {options: {nullable: true, checkFalsy: true}}, trim: true, escape: true, isLength: {
            options: {max: 64}, errorMessage: 'Section name cannot exceed 64 characters',
        }, matches: {
            options: /^[a-zA-Z0-9 @\-!._:*#%?]+$/,
            errorMessage: 'Section name can contain only letter, numbers or @-!._:*#%?'
        }
    }, 'ingredientSections.*.ingredients': {
        isArray: {
            options: {max: 30}, errorMessage: 'Ingredients must be an array with a maximum of 30 items',
        }
    }, 'ingredientSections.*.ingredients.*.name': {
        notEmpty: {
            errorMessage: 'Ingredient name is required',
        }, trim: true, escape: true, isLength: {
            options: {max: 100}, errorMessage: 'Ingredient name cannot exceed 100 characters',
        },
    }, 'ingredientSections.*.ingredients.*.value': {
        optional: {options: {nullable: true, checkFalsy: true}}, trim: true, customSanitizer: {
            options: (value) => customEscape(value),
        }, isLength: {
            options: {max: 7}, errorMessage: 'Ingredient value cannot exceed 7 characters',
        }, matches: {
            options: /^(\d+([.,]\d+)?|\d+\/\d+|\d+\s\d+\/\d+|\d+([.,]\d+)?\s*-\s*\d+([.,]\d+)?)$/,
            errorMessage: 'Ingredient value does not match the expected format'
        }
    }, 'ingredientSections.*.ingredients.*.unit': {
        optional: true, trim: true, escape: true, isLength: {
            options: {max: 20}, errorMessage: 'Unit cannot exceed 20 characters',
        },
    }, 'ingredientSections.*.ingredients.*.type': {
        optional: {options: {nullable: true, checkFalsy: true}}, trim: true, escape: true, isLength: {
            options: {max: 3}, errorMessage: 'Type cannot exceed 3 characters',
        }, isIn: {
            options: [['', 'alt', 'opt']], errorMessage: 'Type must be either "alt", "opt" or empty',
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
    filterSchema, recipeSchema
};