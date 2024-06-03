import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

// create a token to authenticate users
export const createToken = async (user, res, statusCode) => {
    // encode user id and role in token
    const token = jwt.sign({email: user.email, role: user.role, status: user.status }, process.env.PRIVATEKEY, { expiresIn: '1h' })

    if (statusCode === 200) {
         res.status(statusCode).json({
            status: "Success",
            message: "Login successful",
            token: token
        })
    } else {
        res.status(statusCode).json({
            status: "Success",
            message: "Signup successful",
            email: user.email,
            name: user.name
        })
    }
}