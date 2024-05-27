import { User } from "../model/User.js"
import bcrypt from 'bcrypt'

export const resetPassword = async (req, res, next) => {
    const { password, confirmPassword, email } = req.body
    if (!password || !confirmPassword) return res.status(404).json({
        status: "Failed",
        message: "No data received from frontend"
    })

    // check if passwords match
    if (password != confirmPassword) return res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    })
    
    // check if user with email exists
    const user = await User.findOne({ email: email }).catch(err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    }))

    if (!user) return res.status(404).json({
        status: "Failed",
        message: "User with this email not found"
    })

    // check if the new password is same as old/already in use one
    const usedPassword = await bcrypt.compare(password, user.password).catch(err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    }))

    if (usedPassword) return res.status(400).json({
        status: "Failed",
        message: "Password is already being used by this account"
    })

    // encrypt new password and update user details in db with new password
    const hashedPassword = await bcrypt.hash(password, 10).catch(err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    }))

    if (!hashedPassword) return res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    })

    user.password = hashedPassword
    await user.save().catch(err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    }))

    res.status(200).json({
        status: "Success",
        message: "Password resetted succesful"
    })
}