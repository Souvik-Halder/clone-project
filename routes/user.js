const express=require('express');
const app=express.Router();
const User=require('../Models/User')
const bcrypt=require('bcryptjs');
const passport=require('passport');
const { estimatedDocumentCount } = require('../Models/User');
app.get('/register',(req,res)=>{
    res.render('register');
})

app.get('/login',(req,res)=>{
    res.render('login');
})


app.post('/register',(req,res)=>{
    let error=[];
    const {name,email,password,password2}=req.body;
    if(!name || !email || !password || !password2){
      error.push({msg:"Please fill the all fields"});
    }
    if(password !=password2){
        error.push({msg:"Please type the two passwords same"});
    }
    if(password.length<6){
        error.push({msg:"Please create a strong password"});
    }
    if(error.length>0){
        res.render('register',{
            error,
            name,
            email,
            password,
            password2
        });
    }
    else{
      User.findOne({email:email})
        .then(user=>{
            if(user){
                error.push({msg:'Email is already register'})
                res.render('register',{
                    error,
                    name,
                    email,
                    password,
                    password2
                  })
            }
            else{
                const newUser=User({
                    name,email,password,password2
                })
                //Hash Password
                bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    //Set the password to the hash
                    newUser.password=hash;
                    //Save user
                    newUser.save()
                    .then(user=>{
                        req.flash('success_msg','You are now registered and can log in')
                        res.redirect('/users/login')
                    })
                    .catch(err=>console.log(err));
                }))
            }
        })
        
    }
})


app.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req,res,next);
})


module.exports=app;