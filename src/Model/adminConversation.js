const {model,Schema} = require("mongoose");

const adminConversations = new Schema({
    members:{
        type:Array,
        required:true,
    }
},{timestamps:true});

module.exports = model("adminConversations",adminConversations);