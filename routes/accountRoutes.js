import express from 'express'
import { login } from '../controller/loginController.js'
import { resetPassword } from '../controllers/resetPasswordController.js'

export const accountRouter = express.Router()

accountRouter.post('/login', login)
accountRouter.post('/reset-password', resetPassword)