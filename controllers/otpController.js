import OTP from './otpModel.js';

// Controller function to generate OTP
export const generateOTP = async (req, res, next) => {
    try {
        const { otp, expiry } = req.body;
        const newOTP = new OTP({ otp, expiry });
        await newOTP.save();
        res.status(201).json({ message: 'OTP generated successfully' });
    } catch (error) {
        next(error);
    }
};

// Controller function to validate OTP
export const validateOTP = async (req, res, next) => {
    try {
        const { otp } = req.body;
        const existingOTP = await OTP.findOne({ otp, status: 'active' });
        if (existingOTP) {
            const now = new Date();
            if (existingOTP.expiry > now) {
                res.json({ message: 'OTP is valid' });
            } else {
                res.status(400).json({ message: 'OTP has expired' });
            }
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        next(error);
    }
};
