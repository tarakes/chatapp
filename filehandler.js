const path = require('path');
const express = require('express');
const multer=require('multer');
const upload_folder = `${__dirname}/uploads/`;
const filehandler=express.Router();
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,upload_folder);
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
});
var upload = multer({
    storage:storage,
    dest: upload_folder,
    limits:{
        fileSize: 5000000
    },
   
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }

});

filehandler.post("/",upload.single("dp"),(req,res)=>{
 //   console.log(req.query.to);
    req.socket.to(req.query.to).emit("takefile",req.file.originalname,req.query.to,req.query.from,req.query.from);
    req.socket.to(req.query.from).emit("takefile",req.file.originalname,req.query.from,req.query.to,req.query.from);
res.json({err:"no error"});

})
module.exports=filehandler;
