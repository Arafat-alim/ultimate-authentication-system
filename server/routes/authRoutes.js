const express = require("express");

const Router = express.Router();

//! IMporting Controller
const { signup } = require("../controllers/auth");

Router.get("/signup", signup);

module.exports = Router;
