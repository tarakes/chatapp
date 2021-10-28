function chating(server){
const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const io = require('socket.io')(server);


  
   io.on("connection",async(socket)=>{
     // socket.join("test");
     //socket.to("test").emit("newmessg","testig...");
   // io.emit("newmessg","sending to evr1");
    socket.on("join",(cookie,roomcode)=>{
      /*  var token = cookie.toString();
      // var decoded = jwt.verify(token.substr(13,token.length),process.env.ACCESS_TOKEN_KEY);
      //  console.log(decoded.name) // bar
        jwt.verify(token.substr(14,token.length), process.env.ACCESS_TOKEN_KEY, function(err, decoded) {
           if(err){
           console.log(err);*/
          // return;
         //  } // err
           // else{
//console.log(roomcode);
//socket.join(roomcode);
                 // }
                      });
    io.on("sendmessg",(data,room)=>{
      //  console.log(data);
        //console.log(room);
        console.log(data);
       // socket.broadcast.emit("newmessg",`server side${socket.id}`);
       // socket.emit("newmessg",`server side${socket.id}`);
      
    io.emit("newmessg","server test");
    /* socket.in(room).emit("newmessg",data);
     socket.to(room).emit("newmessg",data);
     socket.emit("newmessg","hello from server side");
     socket.in(room).emit("newmessg","hello from server side");*/
    });
      
                      
 //      });
          
   });

}
module.exports=chating;
