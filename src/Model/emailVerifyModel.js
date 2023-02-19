const mongoose = require('mongoose');

const sendCode = mongoose.Schema({
    email:{type:String,required:true},
    otp:{type:Number,required:true},
    createAt:{type:Date,default:Date.now(),index:{expires:"300s"}}
});

module.exports = mongoose.model('Email_Verify',sendCode);