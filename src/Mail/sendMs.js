const nodemailler = require("nodemailer");

const sendMail = async(email,text)=>{
    const transporan = nodemailler.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        }
    });
    await transporan.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "My ChatApp",
        html: `<h3>${text}</h3>`
    })
    .then(res =>{
        console.log(res.messageId);
    })
    .catch(err =>console.log(err.message));
}
module.exports = {sendMail};