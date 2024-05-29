import express from 'express'
import { revokeKey } from '../controllers/revokeKeyController.js'
import { generateKey } from '../controllers/generateKeyController.js'

export const KeyRouter = express.Router()

KeyRouter.get('/generate-key', generateKey)
KeyRouter.patch('/revoke-key', revokeKey)