const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username : {
    type : String, 
    unique : true, 
    minlength : 3, 
    required : true
  }, 
  email : {
    type : String, 
    unique : true, 
    required : true
  }, 
  name : {
    type : String, 
    minlength : 3
  }, 
  passwordHash : {
    type : String, 
    required : true
  }, 
  token : {
    type : String
  }, 
  //
})

userSchema.set('toJSON', {
  transform : (document, modifiedObject) => {
    modifiedObject.id = modifiedObject._id.toString()
    delete modifiedObject._id
    delete modifiedObject.__v
    delete modifiedObject.passwordHash
  }
})

userSchema.set(uniqueValidator)
const User = mongoose.model('User', userSchema)

module.exports = User