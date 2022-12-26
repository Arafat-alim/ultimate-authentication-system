const express = require("express");
const Router = express.Router();

const { read } = require("../controllers/user");

Router.get("/user/:id", read);

module.exports = Router;
