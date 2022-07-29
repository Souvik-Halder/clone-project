const express =require('express');
const expressLayouts= require('express-ejs-layouts');
const mongoose=require('mongoose')
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport')
const path=require('path')
const app=express();




//db config
const db=require('./config/keys').MongoURI;

//connect to Mongo

mongoose.connect(db,{useNewUrlparser:true, useUnifiedTopology: true})
 .then(()=>{
    console.log('MongoDB connected')
 })
 .catch(err =>{
    console.log(err)
 })


const PORT=process.env.PORT|| 3000;

app.use(express.static('public'));

 // EJS

app.set('view engine', 'ejs');




//Bodyparser encoded
app.use(express.urlencoded({
    extended:false
}))

//Express Session
app.use(session({
   secret: 'secret',
   resave: true,
   saveUninitialized: true,
 }))

  //passport config
  app.use(passport.initialize());
  app.use(passport.session());
  
  require('./config/passport')(passport);



 
 //connect falsh
app.use(flash());

//Global variables
app.use((req,res,next)=>{
   res.locals.success_msg=req.flash('success_msg');
   res.locals.error_msg=req.flash('error_msg')
   res.locals.error = req.flash('error');
   next();
})

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/user'))


app.listen(PORT,console.log(`server started on port ${PORT}`));