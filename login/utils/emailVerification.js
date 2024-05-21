// utils/emailVerification.js
const nodemailer = require('nodemailer');

exports.sendVerificationEmail = (userEmail, verificationToken) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'your_email@gmail.com',
            pass: 'your_password'
        }
    });

    const mailOptions = {
        from: 'your_email@gmail.com',
        to: userEmail,
        subject: 'Email Verification',
        text: `Click the link to verify your email: http://localhost:3000/verify?token=${verificationToken}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};