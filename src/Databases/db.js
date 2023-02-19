const mongoose = require("mongoose");
require("dotenv/config");
mongoose.set('strictQuery', true);

const db = async()=>{
try {
    await mongoose.connect(process.env.DB,{useNewUrlParser:true})
    .then(res=>console.log("databases connected..."));
} catch (error) {
    console.log(error)
}
}
db();