const friendRoute = require("express").Router();
const Friend = require("../Controller/friendController");

friendRoute.post("/addFriend",Friend.addFriend);
friendRoute.post("/unFriend",Friend.unFriend);
friendRoute.get("/getFriends",Friend.getFriends);
friendRoute.post("/checkFriends",Friend.checkFriends);


module.exports = friendRoute;