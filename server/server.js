var express = require('express');
var bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

var {App} = require('./models/app');

const app = express();

// Passport Config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI;

//Connect to MongoDB
mongoose.connect(db,{ useNewUrlParser: true})
.then(()=>console.log('MongoDB Connected'))
.catch(err => console.log(err));

//ejs
app.use(expressLayouts);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//BodyParser
app.use(express.urlencoded({ extended: true }));
//app.use(bodyParser.json());

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


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

app.get('/app',(req,res)=>{
  App.find({breakfast:req.body.breakfast, lunch: req.body.lunch, dinner: req.body.dinner}).then((app)=>{
    res.send({app});
  },(e)=>{
    res.status(400).send(e);
  });
});
var port = process.env.PORT || 3000
app.listen(port, ()=>{
  console.log('Started on port 3000');
});
