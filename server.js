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
app.use(express.static(__dirname + '/public'));
//Swagger Setup
var options = {
    // customCss: '.swagger-ui .topbar {background-color: #3f6cff;}.swagger-ui .opblock.opblock-post .opblock-summary-method {background: #0255c1;}',
    customSiteTitle: "First API | Welcome",
    customCssUrl: 'public/css/styles.css',
    customfavIcon: 'public/images/favicon.png'
};
app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument,options))

//By default JSON is disable in Express
app.use(express.json())



app.use(routes)
app.use(errorHandler)



app.listen(APP_PORT,() => console.log(`Listening on port ${APP_PORT}`))