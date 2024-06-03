import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { accountRouter } from './routes/accountRoutes.js'
import { KeyRouter } from './routes/keyRoutes.js'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerui from 'swagger-ui-express'
import YAML from 'yamljs';
import { CronJob } from 'cron'
import { Key } from './model/AccessKey.js'

const app = express()
dotenv.config()

const port = parseInt(process.env.PORT,10) || 3000

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

// set up swagger docs config
const swaggerDocs = YAML.load('./documentation.yaml')

const spacs = swaggerJSDoc(swaggerDocs)
app.use('/api-docs', swaggerui.serve, swaggerui.setup(spacs))

// setting up a cron job to update expired access keys to expired status
// this cron job runs at 6:00am everyday
const job = new CronJob(
    '0 0 8 * * *',
    async function () {
        console.log('cron job run today...')
        const key = await Key.updateMany({ expiry: { $lt: new Date() }, status: 'active'}, { status: 'expired'}).catch(err => console.log(err.message))
    },
    null,
    true,
    'utc'
)

app.use('/api/v1', accountRouter)
app.use('/api/v1', KeyRouter)

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})