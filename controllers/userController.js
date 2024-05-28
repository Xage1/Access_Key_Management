import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import OTP from '../models/otp.js';
import { generateToken } from '../utils/authUtils.js';
import { generateOTP, sendEmail } from '../utils/otpUtils.js';

// Register a new user
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// Authenticate a user
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

// Get user profile
export const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
});

// Get OTP
export const getOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Email is required to get OTP');
    }

    const userExists = await User.findOne({ email });

    if (!userExists) {
        res.status(400);
        throw new Error('Invalid user email');
    }

    // Generate OTP
    const userOTP = generateOTP();

    const otp = await OTP.create({
        otpKey: userOTP,
        author: { email },
    });

    if (otp) {
        await sendEmail(email, userOTP);
        res.status(201).json({ message: 'OTP sent to email' });
    } else {
        res.status(500);
        throw new Error('OTP could not be generated. Please try again');
    }
});

// Reset user password
export const updateUserPassword = asyncHandler(async (req, res) => {
    const { otp, password, email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Please provide email to change password');
    }

    if (!otp) {
        res.status(400);
        throw new Error('Please provide OTP to change password');
    }

    const userOTP = await OTP.findOne({ 'author.email': email }).sort({ createdAt: -1 });

    if (!userOTP || otp !== userOTP.otpKey) {
        res.status(400);
        throw new Error('Invalid OTP');
    }

    if (!password) {
        res.status(400);
        throw new Error('Please provide a new password');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password
    const user = await User.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
    );

    if (user) {
        res.status(201).json({ message: 'Password updated successfully' });
    } else {
        res.status(400);
        throw new Error('Error updating password');
    }
});
