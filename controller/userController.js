import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../model/User';

const router = express.Router();

router.post('/signup/user', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        email,
        password: hashedPassword,
    
    });

    await newUser.save();
    res.status(201).send('User signed up successfully.');
});

export default router;
