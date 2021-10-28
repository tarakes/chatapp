const mongoose = require('mongoose');
const user_details = mongoose.Schema({
    username:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    }
    });
    const userinformation = new mongoose.model("user_id_pw",user_details);
    module.exports=userinformation;