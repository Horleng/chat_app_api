const mongoose = require('mongoose');

const message = mongoose.Schema({
    friendId:{type:String,required:true},
    sender:{type:String,required:true},
    text:{type:String,required:true},
},{timestamps:true});

module.exports = mongoose.model('Message', message);