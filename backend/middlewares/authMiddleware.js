const jwt = require('jsonwebtoken');
require('dotenv').config();

const requireToken = function (req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({error: 'Access denied'});
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({error: 'Invalid token'});
    }
}

const optionalToken = function (req, res, next) {
    const token = req.header('Authorization');
    if (token && token.split(' ').length > 1) {
        try {
            const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
            req.userId = decoded.userId;
        } catch (error) {
            res.status(401).json({error: 'Invalid token'});
        }
    }
    next();
}

module.exports = {requireToken, optionalToken};