const {checkSchema} = require("express-validator");
const {validRequest} = require("./validRequest");

const authSchema = [checkSchema({
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
    password: {
        notEmpty: {
            errorMessage: 'Password is required',
        },
        in: ['body'],
        trim: true,
        escape: true,
        isLength: {
            options: {min: 8, max: 64},
            errorMessage: 'Password must be between 8-64 characters',
        },
    },
    token: {
        notEmpty: {
            errorMessage: 'Token is required',
        },
        in: ['body'],
        trim: true,
        escape: true,
        isLength: {
            options: {max: 5000},
            errorMessage: 'Token cannot exceed 5000 characters',
        },
    },
}), validRequest];

module.exports = {authSchema};