const express = require ("express");
const { register, login, allUsers, singleUser, updateUser, profilePhotoUploadCtrl, whoViewedMyProfileCtrl, followingCtrl, unFollowCtrl, blockedUserCtrl, adminBlockUserCtrl, updateUserCtrl, updatePasswordCtrl, deleteUserCtrl } = require("../Controller/userCtrl");
const isLogin = require("../middlewares/isLogin");
const multer = require("multer");
const storage = require("../Config/cloudinary");
const isAdmin = require("../middlewares/isAdmin");

const userRouter = express.Router()

//instance of multer
const upload = multer({storage})


userRouter.post("/register", register);
userRouter.post("/login", login);

userRouter.get("/", allUsers);

userRouter.get("/profile/",isLogin, singleUser);
userRouter.put("/profile/:id", updateUser);
// userRouter.delete("/profile/:id", deleteUser);
//POST/api/v1/user/profile-photo-upload
userRouter.get("/profile-viewers/:id", isLogin, whoViewedMyProfileCtrl);
userRouter.get("/following/:id", isLogin, followingCtrl);
userRouter.get("/unfollowing/:id", isLogin,unFollowCtrl);
userRouter.get("/block/:id", isLogin, blockedUserCtrl);
userRouter.get("/admin-block/:id", isLogin, isAdmin, adminBlockUserCtrl);
userRouter.get("/update-user/update", isLogin, updateUserCtrl);
userRouter.get("/update-password/update", isLogin, updatePasswordCtrl);
userRouter.delete("/profile/", deleteUserCtrl, isLogin)

userRouter.post(
    "/profile-photo-upload",
    isLogin,
    upload.single("profile"),
    profilePhotoUploadCtrl,
);


module.exports = userRouter;

