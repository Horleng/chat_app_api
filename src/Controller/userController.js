const emailVerifyModel = require("../Model/emailVerifyModel");
const {mailSender} = require("../Mail/nodemailler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Model/userModel");
const { sendMail } = require("../Mail/sendMs");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
cloudinary.config({
    cloud_name:process.env.CLOUND_NAME,
    secure:true,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});
const User = {
    verifyEmail : async(req,res)=>{
        const email = req.body.email;
        const otp = Math.ceil(Math.random()*Math.pow(10,6));
        console.log(otp);
        if(email){
            if(email.includes("@") && email.includes(".com")||email.includes(".kh")||email.includes(".io")){
                try{
                    await UserModel.findOne({email: email})
                    .then(async(respond)=>{
                        if(!respond){
                            const sendCode = new emailVerifyModel({email,otp});
                            await sendCode.save()
                            .then(()=>{
                                mailSender(otp,email);
                                res.status(201).json({message:"code send to your email success",success:true,data:sendCode});
                            })
                        }else
                            res.status(400).json({message:"email already registered",success:false});
                    })
                }catch(er){
                    console.log(er.message);
                }
            }else res.status(400).json({message:"Your email is wrong"});
        }
        else res.status(400).json({message:"Email is required"});
    },
    checkVerify : async(req,res)=>{
        const {email,otp} = req.body;
        if(otp){
            try{
                const checkIn = await emailVerifyModel.find({email:email});
                if(checkIn.length){
                    lastItem = checkIn[checkIn.length-1];
                    if(otp == lastItem.otp){
                        res.status(200).json({message:"email verified",success:true,data:lastItem});
                    }
                    else res.status(400).json({message:"wrong otp code"});
                }
                else res.status(400).json({message:"email not verified"});
            }catch(err){
                console.log(err.message);
            }
        }else res.status(400).json({message:"otp is required"});
    },
    createAccount : async(req,res)=>{
        const {email,password,confirmation} = req.body;
        if(password && confirmation){
            if(confirmation===password){
                const hashPassword = await bcrypt.hash(password,10);
                try{
                    const create = new UserModel({email,password:hashPassword});
                    await create.save()
                    .then(()=>{
                        sendMail(email,"Wellcome to My Website");
                        res.status(200).json({message:"your account created",success:true,data:create});
                    })
                }catch(err){
                    console.log(err.message);
                }
            }else res.status(400).json({message:"your password not match"});
        }else res.status(400).json({message:"password and confirmation is required"});
    },
    userInformation : async(req,res)=>{
        const id = req.query.id;
        const {firstName,lastName,birth,sex,purpos,img} = req.body;
        if(id){
            try{
                if(img){    
                    const isUploaded = await cloudinary.uploader.upload(img, {
                        resource_type:"auto",
                        folder:"ChatApps"
                    })
                    if(isUploaded){
                        await UserModel.findByIdAndUpdate(id,{firstName,lastName,birth,sex,img:isUploaded.secure_url,purpos})
                        .then(()=>{
                            res.status(201).json({message:"your information updated",success:true});
                        })
                    }else res.status(400).json({message:"Can't upload image to server,It's maybe your internet error"});
                }else {
                    await UserModel.findByIdAndUpdate(id,{firstName,lastName,birth,sex,img:"",purpos})
                    .then(()=>{
                        res.status(201).json({message:"your information updated",success:true});
                    })
                }
            }catch(err){
                console.log(err.message);
            }
        }else res.status(400).json({message:"System error"});
    },
    changeImg : async(req,res)=>{
        const id = req.query.id;
        const img = req.body.img;
        if(img){
            if(id){
                try{
                    await cloudinary.uploader.upload(img, {
                        resource_type:"auto",
                        folder:"ChatApps"
                    })
                    .then(async(upl)=>{
                        if(upl){
                            await UserModel.findByIdAndUpdate(id,{img:upl.secure_url})
                            .then(async(isUpdate)=>{
                                if(isUpdate){
                                    await UserModel.findById(id)
                                    .then(async(currdata)=>{
                                        if(currdata){
                                            const token = jwt.sign({
                                                data:currdata
                                            },process.env.JWT_KEY,{expiresIn:"7d"})
                                            res.status(200).json({message:"Change photo successfully",token:token,data:currdata});
                                        }else res.status(400).json({message:"system error"});
                                    });
                                }  
                                else res.status(400).json({message:"System error"});
                        })
                        }else res.status(400).json({message:"Can't upload image,It's maybe server error"});
                    })
                }catch(err){
                    console.log(err.message);
                }
            }else res.status(400).json({message:"System error"});
        }else res.status(400).json({message:"image is required"});
    },
    changeInformation : async(req,res)=>{
        const id = req.query.id;
        const {firstName,lastName,birth,sex,purpos} = req.body;
        if(id){
            if(firstName && lastName && birth && sex && purpos){
                try{
                    await UserModel.findByIdAndUpdate({_id:id},{firstName,lastName,birth,sex,purpos})
                    .then(async(result)=>{
                        if(result){
                            await UserModel.findById(id).then(async(currdata)=>{
                                if(currdata){
                                    const token = jwt.sign({
                                        data:currdata
                                    },process.env.JWT_KEY,{expiresIn:"24h"})
                                    res.status(200).json({message:"your information update successfully!",token:token,data:currdata});

                                }else res.status(400).json({message:"system error"});
                            })
                        }
                        else res.status(400).json({message:"system error"});
                            
                    })
                }catch(err){
                    console.log(err.message);
                }
            }else res.status(400).json({message:"your information is required"});
        }else res.status(400).json({message:"system error"});
    },
    changeEmailAndPassword : async(req,res)=>{
        const id = req.query.id;
        const {email,password} = req.body;
        if(id){
            if(email && password){
                if(email.includes("@") && email.includes(".com") || email.includes(".io") || email.includes(".kh") || email.includes(".org")){
                    try{
                        await UserModel.findOne({email})
                        .then(async(response)=>{
                            if(response){
                                res.status(400).json({message:"This email is already exists."});
                            }else{
                                const hastPassword = await bcrypt.hash(password,5);
                                await UserModel.findByIdAndUpdate({_id:id},{email,password:hastPassword})
                                .then(async(result)=>{
                                    if(result){
                                        await UserModel.findById(id)
                                        .then(currdata=>{
                                            if(currdata){
                                                sendMail(email,`Hi ${result.firstName} You are update account successfully`);
                                                const token = jwt.sign({
                                                    data:currdata
                                                },process.env.JWT_KEY,{expiresIn:"24h"})
                                                res.status(200).json({message:"You are update account successfully",token:token,data:currdata});
                                            }else res.status(400).json({message:"System error"});
                                        })
                                    }
                                    else res.status(400).json({message:"system error"});
                                        
                                })
                            }
                        })
                    }catch(err){
                        console.log(err.message);
                    }
                }else res.status(400).json({message:"Your email is wrong"});
            }else res.status(400).json({message:"your email and password is required"});
        }else res.status(400).json({message:"system error"});
    },

    login : async(req,res)=>{
        const {email,password} = req.body;
        if(email){
            if(password){
                try{
                    await UserModel.findOne({email})
                    .then(async(user)=>{
                        if(user){
                            const isMatch = await bcrypt.compare(password,user.password);
                            if(isMatch){
                                const token = jwt.sign({
                                    data:user
                                },process.env.JWT_KEY,{expiresIn:"24h"});
                                res.status(200).json({message:"login success",token:token,data:user});
                            }
                            else res.status(400).json({message:"your password is incorrect"});
                        }else res.status(400).json({message:"Your email was not registered"});
                    })
                }catch(err){
                    console.log(err.message);
                }
            }else res.status(400).json({message:"password is required"});
        }else res.status(400).json({message:"email is required"});
    },
    updatePassword : async(req,res)=>{
        const {password,confirmation} = req.body;
        const id =req.query.id
        if(password&&confirmation){
            if(password==confirmation){
                try{
                    const hash = await bcrypt.hash(password,10);
                    await UserModel.findByIdAndUpdate({_id:id},{password:hash})
                    .then(async(user)=>{
                        if(user){
                            await UserModel.findById(id)
                            .then(result =>{
                                sendMail(result.email,"your password has been Changed");
                            })
                            const token = jwt.sign({data:user},process.env.JWT_KEY,{expiresIn:"24h"});
                            res.status(200).json({message:"your password change success",token:token});
                        }
                    });
                }catch(err){
                    console.log(err.message);
                }
            }else res.status(400).json({message:"Your new password is not match"});
        }else res.status(400).json({message:"password and confirmation password are required"});
    },
    tokenVerify : async(req,res)=>{
        const token = req.headers["authorization"];
        if(token){
            jwt.verify(token,process.env.JWT_KEY,(err,result)=>{
                if(err) res.status(400).json({message:"invalid token"});
                else res.status(200).json(result);
            })
        }
    },
    getUser : async(req,res)=>{
        const userId = req.query.userId;
        try{
            if(userId){
                await UserModel.findById({_id:userId})
                .then(respond=>{
                    if(respond) res.status(200).json({message:"successfully select",data:respond});
                    else res.status(400).json({message:"somthing was wrong"});
                })
            }else res.status(400).json({message:"somthing wrong"});
        }catch(err){
            console.log(err.message);
        }
    },
    getUserByEmail : async(req,res)=>{
        const email = req.body.email;
        if(email){
            await UserModel.findOne({email: email})
            .then(respond=>{
                if(respond) res.status(200).json({message:"successfully selected",data:respond});
                else res.status(400).json({message:"Not found"});
            })
        }else res.status(400).json({message:"Email is required"});
    },

    forGetPasswordOtp : async(req,res)=>{
        const email = req.body.email;
        if(email){
            if(email.includes("@") && email.includes(".com")){
                await UserModel.findOne({email: email})
                .then(async(respond)=>{
                    if(respond){
                        const otp = Math.ceil(Math.random()*Math.pow(10,6));
                        console.log(otp);
                        const sendCode = new emailVerifyModel({email,otp});
                        await sendCode.save()
                        .then((result)=>{
                            if(result){
                                mailSender(otp, email);
                                res.status(200).json({message:"Code was sent to your email success"});
                            }else res.status(400).json({message:"system wrong"});
                        })
                    }else res.status(400).json({message:"your email never registered"});
                })
            }else res.status(400).json({message:"Your email is wrong"});
        }else res.status(400).json({message:"Email is required"});
    },
    forGetPassword : async(req,res)=>{
        const {password,confirmation,email}= req.body;
        if(password && confirmation && email){
            if(password === confirmation){
                try{
                    const hashPassword = await bcrypt.hash(password,10);
                    await UserModel.findOneAndUpdate({email},{password:hashPassword})
                    .then(respond=>{
                        sendMail(email,"Your password has been changed");
                        if(respond) res.status(201).json({message:"You're created a new password successfully"});
                        else res.status(400).json({message:"Your email was not registered"});
                    })
                }catch(err){
                    res.status(500).json(err.message);
                }
            } else res.status(400).json({message:"your password and confirmation not match"});
        }else res.status(400).json({message:"All field are required"});
    }

}

module.exports = User;