const User = require('../models/user');
const bcrypt = require("bcrypt");
const Recipe = require("../models/recipe");

const OK = (body = {message: "OK"}) => {
    return {status: 200, body: body}
};
const USER_CONFLICT = {status: 409, body: {message: 'User with provided username already exists'}};
const INCORRECT_PASSWORD = {status: 400, body: {message: 'Incorrect password'}};
const EXCEED_LIMIT = {status: 429, body: {message: 'Exceed limit of updating username'}};


const list = async () => {
    return OK(await User.find().select(["username", "active"]));
}

const updateUsername = async (user, username) => {
    try {
        if (!await canUpdateUsername(user)) return EXCEED_LIMIT;
        const conflictUsername = await User.findOne({username: username}).lean();
        if (conflictUsername && !conflictUsername._id.equals(user._id)) return USER_CONFLICT;

        user.username = username;
        user.updatedUsernameAt = Date.now();
        const updatedUser = await user.save();
        await updateUsernameInRecipes(user._id, username);

        return OK(updatedUser.username);
    } catch (error) {
        throw error;
    }
}

const updatePassword = async (user, currentPassword, newPassword) => {
    try {
        if (!await bcrypt.compare(currentPassword, user.password)) return INCORRECT_PASSWORD;

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return OK("Updated password");
    } catch (error) {
        throw error;
    }
}

const updateUsernameInRecipes = async (id, newUsername) => {
    await Recipe.updateMany(
        {'creator._id': id},
        {$set: {'creator.name': newUsername}},
    );
};

const canUpdateUsername = async (user) => {
    return isAtLeastOneDayAfter(user.updatedUsernameAt);
}

const isAtLeastOneDayAfter = (date) => {
    return (Date.now() - date) / (1000 * 60 * 60 * 24) >= 1;
}

module.exports = {
    list,
    updateUsername,
    updatePassword
}