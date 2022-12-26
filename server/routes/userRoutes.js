const express = require("express");
const Router = express.Router();

//! Import controller
const { read, update } = require("../controllers/user");
const { requiredSignIn, adminMiddleware } = require("../controllers/auth");

Router.get("/user/:id", requiredSignIn, read);
Router.put("/user/update", requiredSignIn, update);
Router.put("/admin/update", requiredSignIn, adminMiddleware, update);

module.exports = Router;
