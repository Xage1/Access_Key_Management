import bcrypt from 'bcrypt'
import { User } from "../model/User.js"
import {createToken} from '../middleware/createToken.js'

export const login = async (req, res) => {
    const { email, password } = req.body

     // this code checks to ensure all fields were filled
    if (!email || !password) return res.status(500).json({
        status: 'Failed',
        message: "Form data is not complete"
    })

     // check to see if email exists
    const user = await User.findOne({ email: email }).catch((err) => res.status(500).json({
        status: 'Failed',
        message: "Internal server error"
    }))

    if (!user) return res.status(404).json({
        status: 'Failed',
        message: "Incorrect email or password"
    })
 
    // check to see if user's account is verified
    if (user.status !== 'active') return res.status(500).json({
        status: 'Failed',
        message: 'User\'s account has not been verified'
    })
    
    // check to see password is correct
    const isAuthorized = await bcrypt.compare(password, user.password).catch((err) => res.status(500).json({
        status: 'Failed',
        message: "Internal server error"
    }))

    if (!isAuthorized) return res.status(404).json({
        status: 'Failed',
        message: "Incorrect email or password"
    })
 
    createToken(user, res, 200)
}