// routes/dashboard.js
const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Dashboard route
router.get('/dashboard', authMiddleware.isAuthenticated, dashboardController.getDashboard);

module.exports = router;