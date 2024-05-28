import nodemailer from 'nodemailer';

// Generate OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

// Send email with OTP
export const sendEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: process.env.MICRO_EMAIL,
            pass: process.env.MICRO_PASS,
        },
    });

    const mailOptions = {
        from: process.env.MICRO_EMAIL,
        to: email,
        subject: 'Access Key Manager OTP',
        text: `Use the OTP provided in this email to reset your password on Access Key Manager.\n\nOTP: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
};
