const mongoose = require('mongoose');
const AdminMessage = new mongoose.Schema({
    conversationId:{type:String,required:true},
    sender: {type:mongoose.Schema.Types.ObjectId, required:true,ref:"Users"},
    text:{type:String,required:true}
},{timestamps:true});

module.exports = mongoose.model('AdminMessage', AdminMessage);