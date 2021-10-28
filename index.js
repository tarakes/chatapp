const path = require('path');
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const filehandler=require('./filehandler');


const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000 ;
 const server = app.listen(port);

app.set('view engine','ejs');
 const io = require('socket.io')(server);
app.use(express.json());
app.use(cookieParser());
app.use(express.static(`${__dirname}/public/`));
const loginhandler = require("./loginhandler.js");
const signuphandler = require("./signuphandler");
const usermessage = require('./messgeschema');
const contactlist=require('./contactlist');
//const chating = require('./chathandler');
const userinformation = require('./userschema');
mongoose
.connect(process.env.DB_MESSAGE)
.then(()=>{
  //  console.log("database connected succesfully...")
})
.catch((err)=>{
    console.log(err);
});

io.on("connection",(socket)=>{

  app.use('/submit',(req,res,next)=>{ 
        const token = req.cookies.validate_user;
    if(!token)
    res.sendStatus(403);
    else{
var decode = jwt.verify(token,process.env.ACCESS_TOKEN_KEY);
if(decode != undefined){
    req.socket = socket;    
  //  console.log(decode.name);
   req.query.from=decode.name;
  next();
}
    }
    
 },filehandler);
   socket.on("join",(cookie,roomcode)=>{
       var token = cookie.toString();
       jwt.verify(token.substr(14,token.length), process.env.ACCESS_TOKEN_KEY, function(err, decoded) {
          if(err){
    //      console.log(err);
          } 
           else{
socket.join(roomcode);
                 }
                     }) });
                     socket.on('joinpersonal',(cookie)=>{
                        var token = cookie.toString();
                        jwt.verify(token.substr(14,token.length), process.env.ACCESS_TOKEN_KEY, function(err, decoded) {
                           if(err){
                           console.log(err);
                           } 
                            else{
                               
                 socket.join(decoded.name);
                                  }
                                      }) 
                     })
                    
   socket.on("sendmessg",(data,room,name)=>{
   
      
 socket.to(room).emit("newmessg",`${data}:${name}`);
   
   });
     
        socket.on("denied",(torec,cookie)=>{
           
            var token = cookie.toString();
            jwt.verify(token.substr(14,token.length), process.env.ACCESS_TOKEN_KEY, function(err, decoded) {
               if(err){
               console.log(err);
               } 
            else{
           //     console.log(decoded.name);
                socket.to(torec).emit("call_denied",decoded.name);
            }
            })
           
        })             
    socket.on('search_mycontact_list',(cookie)=>{
        var token = cookie.toString();
        jwt.verify(token.substr(14,token.length), process.env.ACCESS_TOKEN_KEY, function(err, decoded) {
            if(err){
          //  console.log(err);
            } 
             else{
               //  console.log(JSON.stringify(decoded));
  contactlist.find({ 
      $or:[
          {from:decoded.name},
          {to:decoded.name}
      ]
    },(err,doc)=>{
        if(err)
        console.log(err);
        else if(doc.length!=0){
            var array=[];
            
           doc.forEach(element => {
               if(element.from==decoded.name)
               array.push(element.to);
               else
               array.push(element.from);
           });
        socket.emit('take_contact_list',array) }
    })
                   }
                       })
    })
    socket.on('add_new_user',(cookie,data)=>{
        var token = cookie.toString();
        jwt.verify(token.substr(14,token.length), process.env.ACCESS_TOKEN_KEY, function(err, decoded) {
           if(err){
          // console.log(err);
           } 
            else{
                userinformation.findOne({username:data.to},(err,doc)=>{
                    if(err)
                    console.log(err);
                else if(doc){
                    const contactpair = new contactlist({
                        from: decoded.name,
                        to: data.to,
                    });
                    contactpair.save((err)=>{
                        if(err){
                           console.log(err);
                        }
                        else{
                         // console.log("contactpair saved!");
                          socket.emit('take_contact_list',[contactpair.to]);
                        //  console.log(decoded.name);
                        //  console.log(contactpair.to);
                          socket.to(contactpair.to).emit('take_contact_list',[decoded.name]);
                        }
                    })
                }
                else{
                    socket.emit("nosuchuser");
                }
                })
             
                  }
                      })
     })  
     socket.on('give_me_messg',(cookie,user2)=>{
        var token = cookie.toString();
        jwt.verify(token.substr(14,token.length), process.env.ACCESS_TOKEN_KEY, function(err, decoded) {
           if(err){
           console.log(err);
           } 
            else{
               
                usermessage.find({ 
                    $or:[
                        {from:user2, to:decoded.name},
                        {from:decoded.name,to:user2}
                    ]
                  },(err,doc)=>{
                     // console.log(doc);
                      if(err)
                      console.log(err);
                      else{
                          if(doc.length!=0)
                      socket.emit('newmessg',doc);}
                  })
                  }
                      }) 
    
     }) 
    
socket.on('store_messg',(pdata,cookie,receiver)=>{
    var token = cookie.toString();
    jwt.verify(token.substr(14,token.length), process.env.ACCESS_TOKEN_KEY, function(err, decoded) {
       if(err){
       console.log(err);
       } 
        else{
            const messg = new usermessage({
                from: decoded.name,
                to: receiver,
                data:pdata
            });
            messg.save((err)=>{
                if(err){
                   console.log(err);
                }
                else{
                //  console.log("messg saved!");
                  socket.emit('newmessg',[{data:pdata,
                    from:decoded.name,
                to:receiver }]);
              //  console.log(receiver);
                  socket.to(receiver).emit('newmessg',[{data:pdata,
                from:decoded.name,
            to:receiver }]);
                 
                }
            })
              }
                  })
})
  });

app.get('/',(req,res)=>{
 
//res.sendFile(path.join(__dirname+'/public/index.html'))});
res.render('index'); });
app.get('/personalchat',validateuser,(req,res)=>{
    const token = req.cookies.validate_user;
    if(!token){
    res.sendStatus(403);
    return;
    }
    else{
var decode = jwt.verify(token,process.env.ACCESS_TOKEN_KEY);
if(decode == undefined)
res.sendStatus(404);
else{
   //console.log("passed p");
   res.render("personalchat",{peerid:decode.name, portn: port});
}
    }
   
})
app.get('/rdsignup',(req,res)=>{
    res.render('signup');
})
app.get('/img',(req,res,next)=>{
    const token = req.cookies.validate_user;
    if(!token)
    res.sendStatus(403);
    else{
var decode = jwt.verify(token,process.env.ACCESS_TOKEN_KEY);
if(decode.name == req.query.me);
{
  // console.log("passed p");
  next();
}
    }  
},(req,res)=>{
    
    res.sendFile(`${__dirname}/uploads/${req.query.filename}`);
})
 //  res.render("personalchat",{peerid:123});
app.use('/login',loginhandler);
app.use('/chat',validateuser,(req,res,next)=>{
   // console.log("user in chat");
 //const flag = revalidate(req,res);
//    console.log(`${__dirname}/public/inbox`);
 // res.sendFile(path.join(`${__dirname}/public/inbox096b93f46d76811076bacab5ab72949db132d4820fdd3e4e257a010cf6cc4234.html`));
res.render("inbox");
 //  chating(server);

    //next();
});
//const chathandler = require('./chathandler');
app.use('/signup',signuphandler);
app.get('/logout',(req,res)=>{
    try{  res.clearCookie('validate_user');
    res.sendStatus(200);}
  catch(err){
      
  }
})
//app.use('/chat',chathandler);
function validateuser(req,res,next){
    const token = req.cookies.validate_user;
    if(!token)
    res.sendStatus(403);
    else{
var decode = jwt.verify(token,process.env.ACCESS_TOKEN_KEY);
if(decode == undefined)
res.sendStatus(404);
else{
   //console.log("passed");
next();
}
    }
   
}


