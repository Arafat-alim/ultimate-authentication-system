const express = require("express");
const Router = express.Router();

//! Import controller
const { read } = require("../controllers/user");
const { requiredSignIn } = require("../controllers/auth");

Router.get("/user/:id", requiredSignIn, read);

module.exports = Router;
