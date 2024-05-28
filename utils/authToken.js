import jwt from 'jsonwebtoken';

// Function to generate JWT token using user's email, role, and status
import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};


