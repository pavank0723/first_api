import express from 'express'
import { connect } from 'mongoose'
import {APP_PORT, DB_URL} from './config'
import errorHandler from './middlewares/errorHandler'
import mongoose from 'mongoose'

import swaggerJSDoc from 'swagger-jsdoc'
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
//#region Swagger Setup
// const swaggerOprion = {
//     swaggerDefinition:{
//         info:{
//             title: 'First API',
//             description: 'This is simple api for self learning purpose',
//             version: '1.0.0',
//             contact:{
//                 name: 'Pavan Yadav'
//             },
//             servers:["http://localhost:5000/"]
//         }
//     },
//     apis:['./routes/*.js']
// }



// const swaggerDoc = swaggerJSDoc(swaggerOprion)
app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument))

//#endregion

//By default JSON is disable in Express
app.use(express.json())

app.use(routes)
app.use(errorHandler)



app.listen(APP_PORT,() => console.log(`Listening on port ${APP_PORT}`))