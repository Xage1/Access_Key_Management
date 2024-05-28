import express from 'express';
import { registerUser, loginUser, getUser, updateUserPassword, getOTP } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUser);
router.patch('/reset-password', updateUserPassword);
router.post('/otp', getOTP);

export default router;
