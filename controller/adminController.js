import express from 'express';
import bcrypt from 'bcrypt';
import { getNextAdminCode } from '../utils/adminUtils';
import Admin from '../model/Admin';

const router = express.Router();

router.post('/signup/admin', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const nextAdminCode = await getNextAdminCode();

  const newAdmin = new Admin({
    email,
    password: hashedPassword,
    adminCode: nextAdminCode,
  });

  await newAdmin.save();

  res.status(201).send('Admin signed up successfully.');
});

export default router;