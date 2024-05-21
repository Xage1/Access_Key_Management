// routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Sign-up route
router.post('/signup', [
    body('email').isEmail().withMessage('Enter a valid email address.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
], authController.postSignup);

// Login route
router.post('/login', rateLimiter.loginLimiter, authController.postLogin);

// Email verification route
router.get('/verify', authController.getVerifyEmail);

module.exports = router;