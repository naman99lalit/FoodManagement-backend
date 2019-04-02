var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {App} = require('./models/app');
var {Login}= require('./models/login');

var app = express();

app.use(bodyParser.json());

app.post('/login',(req,res)=>{
  var login = new Login({
    name: req.body.name,
    rollno: req.body.rollno,
    branch: req.body.branch,
    hostel: req.body.hostel
  });
  login.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  });
});
app.get('/',(req,res)=>{
  res.send('API is working!');
});
app.post('/app',(req, res) => {
  var now = new Date().getHours()
  console.log(now)
  var date = new Date().getDate() + 1
  var date1= new Date().getDate()
  var dateString = date.toString() +'/' + (new Date().getMonth()+1).toString() + '/' + new Date().getFullYear()
  if(now >= 21 && now < 24) {
    var app= new App({
      date: dateString,
      rollNumber: req.body.rollNumber,
      breakfast: true
    });
    app.save().then((doc)=>{
      res.send(doc);
    },(e)=>{
      res.status(400).send(e);
    });
  }
  else if (now > 9 && now < 12) {
    App.findOneAndUpdate({rollNumber: req.body.rollNumber}, {$set: {lunch: true}})
      .then(user => res.send(user))
  }
  else if(now > 14 && now < 17){
    App.findOneAndUpdate({rollNumber: req.body.rollNumber}, {$set: {dinner: true}})
      .then(user => res.send(user))
  }
  else {
    var rightNow = new Date()
    return res.send(`Cannot book a meal at this hour: ${rightNow}`)
  }
  console.log(dateString)

});
var port = process.env.PORT || 3000
app.listen(port, ()=>{
  console.log('Started on port 3000');
});
