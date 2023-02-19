const AdminMessageModel = require('../Model/AdminMessageModel');
const adminConversation = require('../Model/adminConversation');
const messageModel = require('../Model/messageModel');

const messages = {
    sendMessage : async(req,res)=>{
        const {friendId,sender,text} = req.body;
        if(friendId && sender){
            if(text){
                try{
                    const message = new messageModel({friendId,sender,text});
                    await message.save()
                    .then((response=>{
                        if(response)
                            res.status(201).json({message:"send message successfully",data:response});
                        else 
                            res.status(400).json({message:"system error"});
                    }))
                }catch(err){
                    res.status(500).send(err.message);
                }
            }else res.status(400).json({message:"message is required"});
        }else res.status(400).json({message:"somthing wrong"});
    },
    getMessages : async(req,res)=>{
        const friendId = req.query.friendId;
        if(friendId){
            try{
                await messageModel.find({friendId})
                .then(response => {
                    if(response)
                        res.status(200).json({messages:"successfully",data:response});
                    else res.status(400).message("No message");
                })
            }catch(err){
                res.status(500).send(err.message);
            }
        }else res.status(400).json({message:"system error"});
    },
    createConversationWithAdmin : async(req,res)=>{
        const userId = req.query.userId;
        if(userId){
            try{
                const createCon = new adminConversation({members:["63e9e14cf0eca2f3b830ed58",userId]});
                createCon.save()
                .then(response => {
                    if(response)
                        res.status(201).json({message:"conversation successfully created",data:response});
                    else 
                        res.status(400).json({message:"conversation could not be created"});
                })
            }catch(err){
                console.log(err.message);
            }
        }else res.status(400).json({message:"system error"}); 
    },
    sendMessageToAdmin : async(req,res)=>{
        const {sender,text,conversationId} = req.body;
        if(sender){
            if(text){
                try{
                    const sendMs = new AdminMessageModel({sender,text,conversationId});
                    await sendMs.save()
                    .then(response => {
                        if(response){
                            res.status(201).json({message:"send message to admin successfully",data:response});
                        }
                        else res.status(400).json({message:"send message to admin failed"});
                    })
                }catch(err){
                    console.log(err.message);
                }
            }else res.status(400).json({message:"text is required"});
        }else res.status(400).json({message:"system error"});
    },
    getMsWithAdmin : async(req,res)=>{
        const id = req.query.id;
        if(id){
            await AdminMessageModel.find({conversationId:id})
            .then(response => {
                if(response)
                    res.status(200).json({message:"success",data:response});
                else res.status(400).json({message:"No message"});
            })
        }else res.status(400).json({message:"system error"});
    },
    getCinversationId : async(req,res)=>{
        const id = req.query.id;
        if(id){
            try{
                await adminConversation.find({members:{$in:id}})
                .then(result=>{
                    if(result)
                        res.status(200).json({message:"success",data:result});
                })
            }catch(err){
                console.log(err.message);
            }
        }else res.status(400).json({message:"system error"}); 
    }
}
module.exports = messages;