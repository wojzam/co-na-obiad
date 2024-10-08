const {checkSchema} = require("express-validator");
const {validRequest} = require("./validRequest");

const usernameSchema = [checkSchema({
    username: {
        notEmpty: {
            errorMessage: 'Username is required',
        },
        in: ['body'],
        trim: true,
        escape: true,
        isLength: {
            options: {min: 3, max: 20},
            errorMessage: 'Username must be between 3-20 characters',
        }, matches: {
            options: /^[\p{L}0-9 @\-!.,_:(){}*#%?]+$/u,
            errorMessage: 'Username can contain only letter, numbers or @-!._:(){}*#%?'
        }
    },
}), validRequest];

const newPasswordSchema = [checkSchema({
    currentPassword: {
        notEmpty: {
            errorMessage: 'Current password is required',
        },
        in: ['body'],
        trim: true,
        escape: true,
        isLength: {
            options: {min: 8, max: 64},
            errorMessage: 'Password must be between 8-64 characters',
        },
    },
    newPassword: {
        notEmpty: {
            errorMessage: 'New password is required',
        },
        in: ['body'],
        trim: true,
        escape: true,
        isLength: {
            options: {min: 8, max: 64},
            errorMessage: 'Password must be between 8-64 characters',
        },
    },
}), validRequest];

const resetPasswordSchema = [checkSchema({
    newPassword: {
        notEmpty: {
            errorMessage: 'New password is required',
        },
        in: ['body'],
        trim: true,
        escape: true,
        isLength: {
            options: {min: 8, max: 64},
            errorMessage: 'Password must be between 8-64 characters',
        },
    },
}), validRequest];


const statusSchema = [checkSchema({
    active: {
        notEmpty: {
            errorMessage: 'Active status is required',
        },
        in: ['body'],
        trim: true,
        escape: true,
        isBoolean: {
            errorMessage: 'Active status must be boolean',
        }
    },
}), validRequest];

module.exports = {usernameSchema, newPasswordSchema, resetPasswordSchema, statusSchema};