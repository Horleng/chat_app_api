const mongoose = require('mongoose');

const Friends = mongoose.Schema({
    members:{type:Array,required:true},
    sender:{type:String,required:true}
},{timestamps:true});

module.exports = mongoose.model('Friends',Friends);