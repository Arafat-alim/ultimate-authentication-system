const express = require("express");
const Router = express.Router();

//! Import controller
const { read, update } = require("../controllers/user");
const { requiredSignIn } = require("../controllers/auth");

Router.get("/user/:id", requiredSignIn, read);
Router.put("/user/update", requiredSignIn, update);

module.exports = Router;
