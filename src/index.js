const express = require('express');
const cors = require('cors');
require("./Databases/db");
const app = express();
require("dotenv/config");
const bodyParser = require('body-parser');
const useRoute = require('./Routes/UserRoute');
const friendRoute = require('./Routes/FriendRoute');
const msRoute = require('./Routes/messageRoute');
app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
    origin: true,
  })
);
app.use("/auth",useRoute);
app.use("/friend",friendRoute);
app.use("/message",msRoute);

//socket.io
const {Server} = require('socket.io');
const server = require('http').createServer(app);
const io = new Server(server,{
    cors:{
        origin:"https://playchat.netlify.app",
        methods:["GET","POST"]
    }});
server.listen(process.env.PORT,()=>console.log("http://localhost:"+process.env.PORT));
var users = [];
const getUser = (userId)=>{
    return users.find(user=>user.userId === userId);
}
io.on("connection",socket=>{
    console.log('true')
    socket.on("disconnect",()=>{
        users = users.filter(user=>user.socketId!==socket.id);
    });
    socket.on("joinChat",({authId})=>{
        !users.some(user=>user.userId===authId) && users.push({userId:authId,socketId:socket.id});
        socket.join(socket.id);
    })
    socket.on("sendMessage",data=>{
        const receiver = getUser(data.receiverId);
        socket.to(receiver?.socketId).emit("sendBack",data);
    })
})
