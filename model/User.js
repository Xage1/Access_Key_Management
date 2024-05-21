import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const User = mongoose.model('User', {
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'personnel'], default: 'personnel' },
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
}, 
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});
// Pre-save hook for password hashing
User.pre('save', async function(next) {
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (err) {
            next(err);
        }
    }
    next();
});