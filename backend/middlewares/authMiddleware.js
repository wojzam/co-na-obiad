const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireToken = async function (req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({error: 'Access denied'});
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user || !user.active) return res.status(401).json({error: 'Access denied'})
        req.userId = user._id;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({error: 'Invalid token'});
    }
}

const requireAdmin = async function (req, res, next) {
    const user = req.user;
    if (!user || !user.isAdmin()) return res.status(401).json({error: 'Access denied'})
    next();
}

module.exports = {requireToken, requireAdmin};