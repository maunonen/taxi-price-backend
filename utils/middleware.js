const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if( authorization && authorization.toLowerCase().startsWith('bearer ') ) {
    return authorization.substring(7)
  }
  return null
}

const auth = async (req, res, next ) => {
  try {
    const token = getTokenFrom(req)
    const decoded = jwt.verify(token, process.env.SECRET)
    if ( !decoded){
      throw new Error('Token is not valid')
    }
    const user = await User.findOne({ _id : decoded.id})
    if ( !user){
      throw new Error('User not found')
    }
    req.token = token
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

const regLogger =  (req, res, next) => {
  logger.info('Method', req.method)
  logger.info('Path', req.path)
  logger.info('Body', req.body)
  logger.info('---')
  next()
}

const errorHandler = (error, req, res, next ) => {


  logger.error(error)
  if (error.name === 'CastError' && error.kind === 'ObjectId'){
    return res.status(400).send({
      error : 'malformed id'
    } )
  } else if ( error.name === 'ValidationError'){ 
    return res.status(400).json({ error : error.message })
  }
   else if ( error.name === 'JsonWebTokenError'){ 
    return res.status(401).json({ error : error.message })
  } else {
    return res.status(401).json({ error : error.message })
  }
}

module.exports = {
  auth, errorHandler, regLogger
}