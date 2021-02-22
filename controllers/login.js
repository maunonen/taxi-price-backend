const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
/* const {auth} = require('../utils/middleware') */

loginRouter.post('/', async (req, res, next) => {
  
  try {
    const body = req.body
    const user = await User.findOne({ username : body.username})
    const passwordCorrect = user === null 
      ? false 
      : await bcrypt.compare(body.password, user.passwordHash)

    if ( !(user && passwordCorrect)) {
      return res.status(401).json({
        error : 'Invalid username or password'
      })
    }
    const userForToken = {
      username : user.username, 
      id : user._id 
    }
    const token = jwt.sign( userForToken, process.env.SECRET)
    res.status(200).json({ token, username : user.username, name : user.name})
  } catch (err){
    next(err)
  }
})

module.exports = loginRouter
