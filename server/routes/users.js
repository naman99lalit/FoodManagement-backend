const express = require('express');
const router = express.Router();

//Login Page
router.get('/login',(req,res)=>{
  res.render('login');
});
//Register Page
router.get('/register',(req,res)=> res.render('register'));

//Register Handle
router.post('/register',(req,res)=>{
  const { name , email, password , password2 } = req.body;
  let errors = [];

  //Check required fields
  if(!name || !email || !password || !password2){
    errors.push({msg: 'Please fill all the fields'});
  }

  //Check Passwords Match
  if(password !== password2){
    errors.push({msg:'Passwords do not match'});
  }

  //Check password length
  if(password.length <6)
  {
    errors.push({msg: 'Password should be atleast 6 characters long!'});
  }

  if(errors.length >0){
    res.send('register',{
      errors,
      name,
      email,
      password,
      password2
    });
  }else{
    res.send('Everything is working!');
  }
});
module.exports = router;
