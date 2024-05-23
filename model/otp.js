import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['expired', 'active'],
        default: 'active'
    }
});

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
