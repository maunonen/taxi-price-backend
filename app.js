const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
// router import

const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const priceRouter = require('./controllers/price')

const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const path = require('path'); 


mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true , useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error: Can not connect to MongoDB', error.message )
  })
  
// midlleware goes here
/* app.use(express.static(path.join(__dirname, '/public'))); */
app.use(express.static('public'));
app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(middleware.regLogger)

//Routers goes here 
/* some comment */
/* some comment */
/* some comment */
/* some comment */

app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/price', priceRouter)


app.use(middleware.errorHandler)

module.exports = app