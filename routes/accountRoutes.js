import express from 'express'
import { login } from '../controller/loginController.js'

export const accountRouter = express.Router()

accountRouter.post('/login', login)