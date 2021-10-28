const mongoose = require('mongoose');
const contactpair = mongoose.Schema({
    from:{
        type:String,
        require:true,
    },
    to:{
        type:String,
        require:true,
    }
    });
    const contactlist = new mongoose.model("contactlist",contactpair);
    module.exports=contactlist;