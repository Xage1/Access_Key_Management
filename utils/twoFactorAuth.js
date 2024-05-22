// utils/twoFactorAuth.js
const speakeasy = require('speakeasy');

exports.generateSecret = () => {
    return speakeasy.generateSecret({ length: 20 }).base32;
};

exports.generateQRCode = (secret) => {
    return speakeasy.otpauthURL({ secret, label: 'MyApp', issuer: 'MyApp' });
};

exports.verifyToken = (secret, userToken) => {
    return speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token: userToken,
        window: 1
    });
};