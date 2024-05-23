// controllers/authController.js
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const emailVerification = require('../utils/emailVerification');
const twoFactorAuth = require('../utils/twoFactorAuth');
const passwordStrength = require('../utils/passwordStrength');

exports.postSignup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, birthday, email, password } = req.body;
    if (!passwordStrength.validatePassword(password)) {
        return res.status(400).json({ errors: [{ msg: 'Password is not strong enough.' }] });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const twoFactorSecret = twoFactorAuth.generateSecret();

    const newUser = new User({
        name,
        birthday,
        email,
        password: hashedPassword,
        twoFactorSecret
    });

    await newUser.save();
    emailVerification.sendVerificationEmail(email, 'verificationToken');

    res.redirect('/login');
};

exports.postLogin = async (req, res) => {
    // Implement login logic with 2FA verification
    res.redirect('/dashboard');
};

exports.getVerifyEmail = async (req, res) => {
    // Implement email verification logic
    res.send('Email verified successfully.');
};