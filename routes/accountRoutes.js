import express from 'express'
import { resetPassword } from '../controllers/resetPasswordController.js'
import { login } from '../controllers/loginController.js'
import { adminSignUp, signup } from '../controllers/signupController.js'
import { verifyAccount } from '../controllers/activateAccountController.js'
import { generateOTP, validateOTP } from '../controllers/otpController.js'

export const accountRouter = express.Router()

accountRouter.post('/signup', signup)
accountRouter.post('/admin/signup', adminSignUp)
accountRouter.get('/activate-account', verifyAccount)
accountRouter.post('/login', login)
accountRouter.post('/reset-password', resetPassword)
accountRouter.post('/send-reset-otp', generateOTP)
accountRouter.post('/verify-otp', validateOTP)