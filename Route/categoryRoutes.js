
const express = require("express");
const categoryRouter = express.Router();

// Register User
categoryRouter.post("/register", async (req, res) => {
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
categoryRouter.post("/login", async (req, res) => {
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
categoryRouter.post("/", async (req, res) => {
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
categoryRouter.get("/profile/:id", async (req, res) => {
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
categoryRouter.put("/profile/:id", async (req, res) => {
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
categoryRouter.delete("/profile/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "User data deleted",
    });
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = categoryRouter;