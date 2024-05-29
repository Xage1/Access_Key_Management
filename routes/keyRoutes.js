import express from 'express'
import { revokeKey } from '../controllers/revokeKeyController.js'
import { generateKey } from '../controllers/generateKeyController.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { allKeys } from '../controllers/FetchKeysController.js'

export const KeyRouter = express.Router()

KeyRouter.get('/generate-key', verifyToken, generateKey)
KeyRouter.patch('/revoke-key', verifyToken, revokeKey)
KeyRouter.get('/all-keys', verifyToken, allKeys)