import dotenv from 'dotenv';
import { User } from '../model/User.js';

dotenv.config()

export const verifyAccount = async (req, res) => {
    const { token } = req.query
    
    // check if token was added to url
    if (!token) return res.status(404).json({
        status: "Failed",
        message: "No token found"
    })

    // check if user with token exists
    const user = await User.findOne({ activation_token: token }).catch((err) => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    }))
    if (!user) return res.status(404).json({
        status: "Failed",
        message: "User with this token does not exist"
    })

    // update user account to active and set activation code to null
    user.status = 'active'
    user.activation_token = 'null'
    await user.save().catch(err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    }))

    return res.status(200).json({
        status: "success",
        message: "Account activated successfully"
    })
}