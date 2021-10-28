const mongoose = require('mongoose');
const message = mongoose.Schema({
    from:{
        type:String,
        require:true,
    },
    to:{
        type:String,
        require:true,
    },
    data:{
        type:String,
        require:true,
    },
    time:{
        type:Date,
        default: Date.now,
        require:true,
    }
    });
    const usermessage = new mongoose.model("user_messg",message);
    module.exports=usermessage;