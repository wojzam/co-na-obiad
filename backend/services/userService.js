const User = require('../models/user');
const bcrypt = require("bcrypt");
const Recipe = require("../models/recipe");

const OK = (body = {message: "OK"}) => {
    return {status: 200, body: body}
};
const USER_CONFLICT = {status: 409, body: {message: 'User with provided username already exists'}};
const INCORRECT_PASSWORD = {status: 400, body: {message: 'Incorrect password'}};


const list = async () => {
    return OK(await User.find().select(["username", "active"]));
}

const updateUsername = async (user, username) => {
    try {
        const conflictUsername = await User.findOne({username: username});
        if (conflictUsername && !conflictUsername._id.equals(user._id)) return USER_CONFLICT;

        user.username = username;
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

module.exports = {
    list,
    updateUsername,
    updatePassword
}