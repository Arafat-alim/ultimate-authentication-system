const express = require("express");

const Router = express.Router();

//! IMporting Controller
const { signup } = require("../controllers/auth");

//! Import validator
const { userSignupValidator } = require("../validator/auth");
const { runValidation } = require("../validator");

Router.post("/signup", userSignupValidator, runValidation, signup);

module.exports = Router;
