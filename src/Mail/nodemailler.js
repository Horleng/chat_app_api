const nodemailler = require('nodemailer');
require('dotenv/config');
async function mailSender(code,userEmail){
    const transporan = nodemailler.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        }
    });
    await transporan.sendMail({
        from:process.env.EMAIL,
        to:userEmail,
        subject:"Verify SignUp",
        html:`<h6>Your code to verify sign </h6><h1>${code}</h1><br><h6>Let Sign in now...</h6>`
    })
    .then((res)=>{
        console.log(res.messageId);
    })
    .catch(err=>console.log(err));
}
module.exports = {mailSender}