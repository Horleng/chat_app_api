const friendModel = require("../Model/friendModel");

const Friend = {
    addFriend: async (req, res) => {
        const {authId,userId} = req.body;
        if(userId && authId){
            try {
                await friendModel.findOne({$and:[{members:{$in:authId}},{members:{$in:userId}}]})
                .then(async(isfriend)=>{
                    if(isfriend)
                        res.status(400).json({message:"You are already be a friend"});
                    else{
                        const isFriend = new friendModel({members:[authId,userId],sender:authId});
                        await isFriend.save()
                        .then(re=>{
                            res.status(201).json({message:"Add friend successfully",data:re});
                        })
                    }
                })
            } catch (error) {
                res.status(500).json(error.message);
            }
        }else res.status(400).json({message:"somthing was wrong"});
    },
    unFriend : async (req, res) => {
        const {authId,userId} = req.body;
        if(userId && authId){
            try{
                await friendModel.findOne({$and:[{members:{$in:authId}},{members:{$in:userId}}]})
                .then(async(respond)=>{
                    if(respond){
                        await friendModel.findByIdAndDelete(respond._id)
                        .then((isDelete)=>{
                            if(isDelete) res.status(200).json({message:"you was unfriend successfully"});
                            else res.status(400).json({message:"System error"});
                        })
                    }
                    else res.status(404).json({message:"not friends"});
                })
            }catch(error){
                res.status(500).json(error.message);
            }
        }else res.status(400).json({message:"somthing was wrong"});
    },
    getFriends : async (req, res) => {
        const userId = req.query.userId;
        if(userId){
            try{
                const friends = await friendModel.find({members:{$in:userId}});
                if(friends.length){
                    res.status(200).json({message:"successfully",data:friends});
                }
            }catch(error){
                console.log(error.message);
                res.status(500).json(error.message);
            }
        }
        else res.status(400).json({message:"System error"});
    },
    checkFriends : async (req, res) => {
        const {authId,userId} = req.body;
        if(userId&&authId){
            try{
                await friendModel.findOne({$and:[{members:{$in:authId}},{members:{$in:userId}}]})
                .then(respond=>{
                    if(respond){
                        res.status(200).json({message:"found",isFriend:true,data:respond});
                    }else res.status(400).json({message:"Not friend",isFriend:false});
                })
            }catch(err){
                res.status(500).json(err.message);
            }
        }else res.status(400).json({message:"Somthing was wrong"});
    }
}

module.exports = Friend;