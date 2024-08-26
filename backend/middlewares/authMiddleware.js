const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireToken = async function (req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({error: 'Access denied'});
    try {
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user || !user.active) return res.status(401).json({error: 'Access denied'})
        req.userId = user._id;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({error: 'Invalid token'});
    }
}

const optionalToken = async function (req, res, next) {
    const authHeader = req.header('Authorization');
    if (authHeader) {
        try {
            const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (user && user.active) {
                req.userId = user._id;
                req.user = user;
            }
        } catch (error) {
        }
    }
    next();
}

const requireAdmin = async function (req, res, next) {
    const user = req.user;
    if (!user || !user.isAdmin()) return res.status(401).json({error: 'Access denied'})
    next();
}

module.exports = {requireToken, optionalToken, requireAdmin};