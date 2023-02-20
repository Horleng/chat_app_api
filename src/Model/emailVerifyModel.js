const mongoose = require('mongoose');

const sendCode = mongoose.Schema({
    email:{type:String,required:true},
    otp:{type:Number,required:true},
    createdAt:{type:Date,default:Date.now,index:{expires:"5m"}}
});

module.exports = mongoose.model('Email_Verify',sendCode);
