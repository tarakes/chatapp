const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const loginhandler = express.Router();
const userinformation=require('./userschema');
     mongoose
    .connect(process.env.DB_MESSAGE)
    .then(()=>{
        console.log("database connected succesfully...")
    })
    .catch((err)=>{
        console.log(err);
    });
   
loginhandler.post('/',(req,res)=>{
  
        userinformation.findOne({username:req.body.username},(err,doc)=>{
          
            if(doc == false || doc==null){
                res.json({err:"user not found"});
                return;
            }
            else{
bcrypt.compare(req.body.password,doc.password,(err,result)=>{
 
   if(!result){
   res.json({err:"invalid username or password"});
   }
    else{
       const user={name:req.body.username};
       const accesstoken = jwt.sign(user,process.env.ACCESS_TOKEN_KEY,{expiresIn:'48h'});
    //  res.header('Access-Control-Allow-Credentials',true);
       res.cookie("validate_user",accesstoken,{ maxAge: 172800000 }).json({err:null});
    
    }
})
            }
        })
})

module.exports = loginhandler;