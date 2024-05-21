// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const helmet = require('helmet');
const path = require('path');

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

// Import controllers
const authController = require('./controllers/authController');
const dashboardController = require('./controllers/dashboardController');

// Import middleware
const authMiddleware = require('./middleware/authMiddleware');
const rateLimiter = require('./middleware/rateLimiter');

// Import models
const User = require('./models/user');

// Import utils
const emailVerification = require('./utils/emailVerification');
const logger = require('./utils/logger');
const passwordStrength = require('./utils/passwordStrength');
const twoFactorAuth = require('./utils/twoFactorAuth');

const app = express();
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/Users',
    collection: 'sessions'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(csrf());
app.use(helmet());

app.use(express.static(path.join(__dirname, 'views')));
app.use(authRoutes);
app.use(dashboardRoutes);

mongoose.connect('mongodb://localhost:27017/Users', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(3000, () => {
            logger.info('Server is running on port 3000');
        });
    })
    .catch(err => {
        logger.error(err);
    });clear