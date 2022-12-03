import express from 'express'

import {APP_PORT, DB_URL} from './config'
import errorHandler from './middlewares/errorHandler'
import mongoose from 'mongoose'
import path from 'path'

import swaggerUi  from 'swagger-ui-express'
import swaggerDocument from './swagger.json'

const app = express()

import routes from './routes/index'

//#region DB Connection
mongoose.connect(DB_URL)

const db = mongoose.connection;

db.on('error',console.error.bind(console,'connection error: '))
db.once('open',() =>{
    console.log('DB connected...')
})
//#endregion

// app.use(express.static(__dirname + '/public'));

//#region Swagger Setup
var options = {
    // customCss: '.swagger-ui .topbar {background-color: #3f6cff;}.swagger-ui .opblock.opblock-post .opblock-summary-method {background: #0255c1;}',
    customSiteTitle: "First API | Welcome",
    customCssUrl: 'public/css/styles.css',
    customfavIcon: 'public/images/favicon.png'
};

app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument,options))
//#endregion

//By default JSON is disable in Express
app.use(express.json())

//Get the root folder
global.appRoot = path.resolve(__dirname)
app.use(express.urlencoded({extended:false}))

//View image 
app.use('/uploads',express.static('uploads'))

app.use(routes)
app.use(errorHandler)

app.listen(APP_PORT,() => console.log(`Listening on port ${APP_PORT}`))