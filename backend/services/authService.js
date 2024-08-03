const axios = require("axios");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const duplicateErrorCode = 11000;

const OK = (body) => {
    return {status: 200, body: body}
};
const REGISTERED = (body) => {
    return {status: 201, body: body}
};
const UNAUTHORIZED = {status: 401, body: {message: 'Unauthorized'}};
const USER_CONFLICT = {status: 409, body: {message: 'User with provided username already exists'}};
const AUTHORIZED_RESPONSE_BODY = (user) => {
    return {token: generateToken(user), user: user.username, id: user._id}
}

function generateToken(user) {
    return jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
        expiresIn: '168h',
    });
}

const register = async (username, password, token) => {
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${token}`
        );
        if (!response.data.success) return UNAUTHORIZED;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({username: username, password: hashedPassword});
        await user.save();

        return REGISTERED(AUTHORIZED_RESPONSE_BODY(user));
    } catch (error) {
        if (error.code === duplicateErrorCode) return USER_CONFLICT;
        throw error;
    }
};

const login = async (username, password) => {
    const user = await User.findOne({username: username});
    if (!user) return UNAUTHORIZED;
    if (!await bcrypt.compare(password, user.password)) return UNAUTHORIZED;

    return OK(AUTHORIZED_RESPONSE_BODY(user));
};

module.exports = {
    register,
    login
};