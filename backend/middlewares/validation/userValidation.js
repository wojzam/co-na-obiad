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
            options: /^[a-zA-Z0-9 @\-!._:*#%?]+$/,
            errorMessage: 'Username can contain only letter, numbers or @-!._:*#%?'
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

module.exports = {usernameSchema, newPasswordSchema};