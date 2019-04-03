var express = require('express');
var bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

var {App} = require('./models/app');
var {Login}= require('./models/login');

const app = express();

//DB Config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db,{ useNewUrlParser: true})
.then(()=>console.log('MongoDB Connected'))
.catch(err => console.log(err));

//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BodyParser
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

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
app.post('/app',(req, res) => {
  // GET Indian Time
  var currentDate = new Date()
  var currentOffset = currentDate.getTimezoneOffset();
  var ISTOffset = 330
  currentDate = new Date(currentDate.getTime() + (ISTOffset + currentOffset)*60000)

  var now = new Date().getHours()
  console.log(now)
  var date = currentDate.getDate() + 1
  var date1= currentDate.getDate()
  var dateString = date.toString() +'/' + (currentDate.getMonth()+1).toString() + '/' + currentDate.getFullYear()
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
  else if (now >= 9 && now < 12) {
    console.log('Here')
    var today = date1 + '/' + (currentDate.getMonth()+1).toString() + '/' + currentDate.getFullYear()
    console.log(today)
    App.findOneAndUpdate({rollNumber: req.body.rollNumber, date: today}, {$set: {lunch: true}})
      .then(user => res.send(user))
  }
  else if(now > 14 && now < 17){
    App.findOneAndUpdate({rollNumber: req.body.rollNumber}, {$set: {dinner: true}})
      .then(user => res.send(user))
  }
  else {
    var rightNow = currentDate
    return res.send(`Cannot book a meal at this hour: ${rightNow}`)
  }
  console.log(dateString)

});
var port = process.env.PORT || 3000
app.listen(port, ()=>{
  console.log('Started on port 3000');
});
