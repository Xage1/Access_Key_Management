import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { User } from "../model/User.js";
import { transporter } from '../config/mailer.js';
import { createToken } from '../middleware/createToken.js';

export const signup = async (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    
    // this code checks to ensure all fields were filled
    if (!email || !password || !confirmPassword) return res.status(500).json({
        status: "Failed",
        message: "Incomplete form data"
    })

    // check to see if email is not already in use
    const user = await User.findOne({ email: email }).catch((err) => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    }))
    if (user) return res.status(500).json({
        status: "Failed",
        message: "User with email already exists"
    })

    // check if passwords match
    if (password !== confirmPassword) return res.status(500).json({
        status: "Failed",
        message: "Passwords do not match"
    })

    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10).catch((err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    })))
    const token = crypto.randomBytes(16).toString('hex')
    const activation_url = process.env.URL + `/activate-account?token=${token}`
    
    // send email to user for account verification
    await transporter.sendMail({
        from: '"Access Key Manager." <eugeneatinbire@gmail.com',
        to: '<' + email + '>',
        subject: "Account verification",
        html: `<div><p>Hi,</p><p>Click <a href=${activation_url}>here</a> to activate your account.</p></div>`
    }).catch((err) => {
       return res.status(500).json({
        status: "Failed",
        message: "Failed to send verification mail"
    })
    })
    
    // create new user
    const newUser = new User({
        email: email,
        password: hashedPassword,
        activation_token: token
    })
    
    // save new user in database
    await newUser.save()
    .then((user) => createToken(user, res, 201))
    .catch((err) => {
        console.log(err)
        return res.status(500).json({
            status: "Failed",
            message: "Internal server error"
        })
})
}

export const adminSignUp = async (req, res, ) => {
    const { email, password, confirmPassword } = req.body;
    
    // this code checks to ensure all fields were filled
    if (!email || !password || !confirmPassword) return res.status(500).json({
        status: "Failed",
        message: "Incomplete form data"
    })

    // check to see if email is not already in use
    const user = await User.findOne({ email: email }).catch((err) => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    }))
    if (user) return res.status(500).json({
        status: "Failed",
        message: "User with email already exists"
    })

    // check if passwords match
    if (password !== confirmPassword) return res.status(500).json({
        status: "Failed",
        message: "Passwords do not match"
    })

    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 10).catch((err => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    })))
    const token = crypto.randomBytes(16).toString('hex')
    const activation_url = process.env.URL + `/activate-account?token=${token}`

    // send email to user for account verification
    await transporter.sendMail({
        from: '"Access Key Manager." <eugeneatinbire@gmail.com',
        to: '<' + email + '>',
        subject: "Account verification",
        html: `<div><p>Hi,</p><p>Click <a href=${activation_url}>here</a> to activate your account.</p></div>`
    }).catch((err) => {
       return res.status(500).json({
        status: "Failed",
        message: "Failed to send verification mail"
    })
    })

    // create new user
    const newUser = new User({
        email: email,
        password: hashedPassword,
        activation_token: token,
        role: 'admin'
    })

    // save new user in database
    await newUser.save()
    .then((user) => createToken(user, res, 201))
    .catch((err) => res.status(500).json({
        status: "Failed",
        message: "Internal server error"
    }))
}