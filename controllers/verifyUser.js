//User verification
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/verify', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Activation token is missing' });
    }
    // Find the user by activation token
    const user = await User.findOne({ activationToken: token });

    //Check if user with given activation token exists
    if (!user) {
      return res.status(404).json({ error: 'Invalid activation token' });
    }
    //Update user's account status to active
    user.active = true;
    user.activationToken = null;
    await user.save();

    return res.status(200).json({ message: 'User account verified successfully' });
  } catch (error) {
    console.error('Error verifying user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
