import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

const app = express()
dotenv.config()

const port = parseInt(process.env.PORT, 10) || 3000;

// set up database connection
mongoose.connect(process.env.DATABASE_URL);

var set = mongoose.connection;
set.on('error', console.error.bind(console, 'connection error:'));
set.once('open', function() {
    console.log('Db connected successfully')
});

// setting up middleware to parse body data
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});