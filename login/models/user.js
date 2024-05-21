// models/user.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    birthday: Date,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: String
});

module.exports = mongoose.model('User', UserSchema);