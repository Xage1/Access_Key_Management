import mongoose from 'mongoose';

export const Admin = mongoose.model('Admin', {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin'], default: 'admin' },
    adminCode: { type: String, required: true, unique: true },
    status: { type: String, required: true, default: 'inactive' },
    activation_token: { type: String, required: true },
    key: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Key'
    }],
    otp: [{
        type: mongoose.Schema.ObjectId,
        ref: 'OTP'
    }]
});