var mongoose = require('mongoose');
let date = require('date-and-time');

let now = new Date();
let today = date.format(now, 'YYYY/MM/DD HH:mm:ss');

var App = mongoose.model('App',{
  date:{
    type: String
  },
  rollNumber: {
    type: String,
    required: true
  },
  breakfast:{
    type:Boolean,
    default:false
  },
  lunch:{
    type:Boolean,
    default:false
  },
  dinner:{
    type:Boolean,
    default:false
  }
});

module.exports = {App};
