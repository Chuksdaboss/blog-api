
const express = require("express");
const commentRouter = express.Router();
const isLogin = require('../middlewares/isLogin')

// Register User
commentRouter.post("/register", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "User registered successfully",
    });
  } catch (error) {
    res.json(error.message);
  }
});

// Login User
commentRouter.post("/login", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "User Login success",
    });
  } catch (error) {
    res.json(error.message);
  }
});

// All comment
commentRouter.post("/", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "All Users ",
    });
  } catch (error) {
    res.json(error.message);
  }
});

// Single comment
commentRouter.get("/profile/:id", async (req, res) => {
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
commentRouter.put("/profile/:id", async (req, res) => {
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
commentRouter.delete("/profile/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "User data deleted",
    });
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = commentRouter;