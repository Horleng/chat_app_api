const jwt = require('jsonwebtoken');
const verifytoken = async(req,res,next)=>{
    const token = req.headers["authorization"];
    if(token){
        jwt.verify(token,process.env.JWT_KEY,(err,result)=>{
            if (err) res.status(400).json({message:"Unauthention"});
            else next();
        })
    }
}
module.exports = verifytoken;