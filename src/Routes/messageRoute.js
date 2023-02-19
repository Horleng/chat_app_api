const msRoute = require("express").Router();
const messageController = require("../Controller/messageController");

msRoute.post("/send",messageController.sendMessage);
msRoute.get("/get",messageController.getMessages);
msRoute.post("/sendMessageToAdmin",messageController.sendMessageToAdmin);
msRoute.get("/getMsWithAdmin",messageController.getMsWithAdmin);
msRoute.get("/createConverWithAdmin",messageController.createConversationWithAdmin);
msRoute.get("/getCinversationId",messageController.getCinversationId);


module.exports = msRoute;