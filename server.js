import express from 'express'

import {APP_PORT, DB_URL} from './config'
import errorHandler from './middlewares/errorHandler'
import mongoose from 'mongoose'

import swaggerUi  from 'swagger-ui-express'
import swaggerDocument from './swagger.json'

const app = express()

import routes from './routes/index'

//DB Connection
mongoose.connect(DB_URL,{useNewUrlParser:true, useUnifiedTopology:true})

const db = mongoose.connection;

db.on('error',console.error.bind(console,'connection error: '))
db.once('open',() =>{
    console.log('DB connected...')
})

//#endregion

//Swagger Setup
app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument))

//By default JSON is disable in Express
app.use(express.json())

app.use(routes)
app.use(errorHandler)



app.listen(APP_PORT,() => console.log(`Listening on port ${APP_PORT}`))