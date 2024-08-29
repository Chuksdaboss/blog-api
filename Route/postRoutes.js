
const express = require("express");
const { createPostCtrl, fetchPostsCtrl, toggleLikesPostCtrl, toggleDisLikesPostCtrl, deletePost } = require("../Controller/postCtrl");
const isLogin = require("../middlewares/isLogin");
const postRouter = express.Router();
const multer = require("multer");
const storage = require("../Config/cloudinary")


const upload = multer({ storage })


// Creat Post
postRouter.post("/",isLogin, createPostCtrl);
postRouter.get("/",isLogin, fetchPostsCtrl);
postRouter.get("/likes/:id",isLogin, toggleLikesPostCtrl);
postRouter.get("/dislikes/:id",isLogin, toggleDisLikesPostCtrl);
postRouter.get("/views/:id",isLogin, toggleDisLikesPostCtrl);
postRouter.delete("/:id", isLogin, deletePost);
postRouter.put("/:id", isLogin, upload.single("photo"),);





// All User
postRouter.get("/", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "All Users ",
    });
  } catch (error) {
    res.json(error.message);
  }
});

// Single User
postRouter.get("/profile/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Single User ",
    });
  } catch (error) {
    res.json(error.message);
  }
});


// Update User
postRouter.put("/profile/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Update User ",
    });
  } catch (error) {
    res.json(error.message);
  }
});

// Delete User
postRouter.delete("/profile/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "User data deleted",
    });
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = postRouter;