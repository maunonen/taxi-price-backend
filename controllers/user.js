const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')
const {auth} = require('../utils/middleware')

console.log('User Router')
userRouter.get('/', async (req, res, next) => {
  console.log('GET REQUEST')
  try{
    const users = await User.find({})
    if (users.length === 0){
      return res.status(404).json({ error : 'Users not found'})
    } 
    res.json( users.map( user => user.toJSON()))
  } catch (err) {
    next(err)
  }
})

userRouter.get('/profile', auth, async (req, res, next) => {
  try {
    if (!req.user._id){
      return res.status(401).json({ error : '401 error'})
    } 
    const user = await User.findById(req.user._id)
    if (user) {
      res.json(user.toJSON())
    } else {
      res.status(404).send({ error : '404 Not found'})
    }
  } catch(err){
    next(err)
  }
})

userRouter.put('/', auth, async (req, res, next) => {
  try {
    const body = req.body
    const updateObject = {
      name :body.name , 
      username : body.username, 
      email : body.email, 
    }
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateObject, { new : true})
    res.status(200).json(updatedUser)
  } catch(err){
    next(err)
  }
})

/* Register user */

userRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body
    const userObject = {}
    if ( body.password === undefined || body.username === undefined || body.email === undefined || body.name === undefined) {
      return res.status(400).json({ error : 'Missed password, name, username or email'})
    }
    if ( body.password.length < 6 || body.username.length < 6 || body.email.length < 6 ){
      return res.status(400).json({ error : "Password, username, email must be at least 6 symbol"})
    }
    if ( body.name < 3  ){
      return res.status(400).json({ error : "Name must be at least 3 symbol"})
    }
    /* if ( body.name ){
      userObject['name'] = body.name
    }
    if ( body.email ){
      userObject['email'] = body.email
    }
    if ( body.username ){
      userObject['username'] = body.username
    } */
    /* create user object  */
    userObject['username'] = body.username
    userObject['name'] = body.name
    userObject['email'] = body.email
    
    /* create hash password */
    const saltRounds = 10 
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    /* userObject['password'] Salomon Ultimate= body.password */
    const user = new User({ ...userObject, passwordHash})
    const savedUser = await user.save()
    return res.json(savedUser.toJSON())
  } catch (err){
    //console.log(err)
    next(err)
  }
})

module.exports = userRouter