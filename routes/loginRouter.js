/** @format */

const express = require("express");
const loginRouter = express.Router();
const userController = require("../controllers/userController");

// Login page route - renders the login page
loginRouter.get("/", userController.renderLoginPage);

// This route handles updating a user by their ID.
loginRouter.put("/:userId", userController.updateUser);

// Signup page route - renders the signup page (create this view if needed)
loginRouter.get("/signup", userController.renderSignupPage);

loginRouter.post("/", userController.login);

// Signup POST route - handles user creation
loginRouter.post("/signup", userController.createUser);

module.exports = loginRouter;
