const mongoose = require('mongoose');
const User = mongoose.Schema({
    firstName:{type:String,default:""},
    lastName:{type:String,default:""},
    sex:{type:String,default:""},
    purpos:{type:String,default:""},
    img:{type:String,default:"https://www.pngitem.com/pimgs/m/35-350426_profile-icon-png-default-profile-picture-png-transparent.png"},
    birth:{type:Date,default:""},
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true},
},{timestamps:true});
module.exports = mongoose.model('Users',User);