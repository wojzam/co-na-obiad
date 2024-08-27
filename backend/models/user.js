const mongoose = require('mongoose');

const ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN'
};

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: {type: String, enum: Object.values(ROLES), default: ROLES.USER},
    active: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    updatedUsernameAt: {type: Date, default: Date.now},
}, {
    versionKey: false
});

userSchema.methods.isAdmin = function () {
    return this.role === ROLES.ADMIN;
};

userSchema.methods.isUser = function () {
    return this.role === ROLES.USER;
};

module.exports = mongoose.model('User', userSchema);