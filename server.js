const express=require('express');
const expressLayout = require('express-ejs-layouts');

const app=express();
const PORT=process.env.PORT||3000;
const path=require('path');

app.use(express.static('public'));


//Ejs engine


app.set('view engine', 'ejs');

//Routes
app.use('/',require('./routes/index'));


app.listen(PORT,(err)=>{
    console.log(`Listening at the port ${PORT}`)
})