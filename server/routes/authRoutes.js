const express = require("express");

const Router = express.Router();

//! IMporting Controller
const {
  signup,
  accountActivation,
  login,
  resetPassword,
  forgotPassword,
  googleLogin,
  facebookLogin,
} = require("../controllers/auth");

//! Import validator
const {
  userSignupValidator,
  userLoginValidator,
  resetPasswordValidator,
  forgotPasswordValidator,
} = require("../validator/auth");
const { runValidation } = require("../validator");

Router.post("/signup", userSignupValidator, runValidation, signup);
Router.post("/account-activation", accountActivation);
Router.post("/login", userLoginValidator, runValidation, login);
//! Forgot password Routes
Router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);

Router.put(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

//! Google and facebook routes
Router.post("/api/google-login", googleLogin);
Router.post("/facebook-login", facebookLogin);

module.exports = Router;
