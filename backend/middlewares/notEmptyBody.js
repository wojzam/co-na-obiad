const {body, validationResult} = require('express-validator');

const notEmptyBody = (fields) => [
    body(fields).trim().notEmpty().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({message: errors.array()});
        }
        next();
    }
];

module.exports = notEmptyBody;