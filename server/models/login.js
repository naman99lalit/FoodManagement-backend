var mongoose = require('mongoose');

var Login = mongoose.model('Login',{
  name:{
    type:String,
    minlength:1,
    trim:true,
    required:true
  },
  rollno:{
    type:Number,
    required:true,
    trim:true
  },
  branch:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  },
  hostel:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  }
});
module.exports = {Login};
