const express = require("express");

const Router = express.Router();

//! IMporting Controller
const { signup, accountActivation, login } = require("../controllers/auth");

//! Import validator
const {
  userSignupValidator,
  userLoginValidator,
} = require("../validator/auth");
const { runValidation } = require("../validator");

Router.post("/signup", userSignupValidator, runValidation, signup);
Router.post("/account-activation", accountActivation);
Router.post("/login", userLoginValidator, runValidation, login);
module.exports = Router;
