const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

//Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Access Key Generator API');
});

//Routes
const accessKeyRoutes = require('./routes/accessKey');
app.use('/api/access-keys', accessKeyRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});