const User = require("../Controller/userController");
const useRoute = require("express").Router();
const verifyTokent = require("../middleware/verifyToken");
useRoute.post("/verifyEmail",User.verifyEmail);
useRoute.post("/verified",User.checkVerify);
useRoute.post("/createAccount",User.createAccount);
useRoute.post("/userInformation",User.userInformation);
useRoute.post("/changePhoto",User.changeImg);
useRoute.post("/changInformation",User.changeInformation);
useRoute.post("/changeEmailAndPassword",User.changeEmailAndPassword);
useRoute.post("/login",User.login);
useRoute.post("/forGetPassword",User.forGetPassword);
useRoute.post("/forGetPasswordOtp",User.forGetPasswordOtp);
useRoute.get("/tokenVerify",User.tokenVerify);
useRoute.get("/getUserById",User.getUser);
useRoute.post("/getUserByEmail",User.getUserByEmail);
useRoute.post("/changePassword",verifyTokent,User.updatePassword);

module.exports = useRoute;