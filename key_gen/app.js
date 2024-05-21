const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

//Routes
const accessKeyRoutes = require('./routes/accessKey');
app.use('/api/access-keys', accessKeyRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});