const express = require('express');
const mongoose = require('mongoose');
const signuphandler = express.Router();
const inbox = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userinformation=require('./userschema');
 mongoose
.connect(process.env.DB_MESSAGE)
.then(()=>{
    console.log("database connected succesfully...")
})
.catch((err)=>{
    console.log(err);
});
signuphandler.post('/',async (req,res)=>{
try {
    userinformation.findOne({username:req.body.username},(err,doc)=>{
        if(err)
        console.log(err);
       
  if(!doc && req.body.username!="" && req.body.password!=""){
      
    bcrypt.hash(req.body.password, 10, async (err, hash)=> {
        //    Store hash in your password DB.
         // console.log(hash);   
        /*   res.cookie("mydetails",{
               id: req.body.username,
               pw: hash,
           });*/
         //  res.send(JSON.stringify(dataobj));
         const newuser = new userinformation({
             username: req.body.username,
             password: hash,
         });
         await newuser.save((err)=>{
             if(err){
                console.log(err);
                res.status(500).send();
             }
             else{
                const user={name:req.body.username};
                const accesstoken = jwt.sign(user,process.env.ACCESS_TOKEN_KEY,{expiresIn:'48h'});
             //  res.header('Access-Control-Allow-Credentials',true);
                res.cookie("validate_user",accesstoken,{ maxAge: 172800000 }).json({err:null});
             
            //     res.status(200).json({err:null});
             }
         })
         
       });
   
   
  }
  else if( req.body.username=="" && req.body.password==""){
    res.json({error: "Username or password can't be blank!"});  
  }
    else{
        res.json({error: "already registered with same id!"});
    }   
    })
 
} catch (err) {
  console.log(err);
}
})
module.exports = signuphandler;