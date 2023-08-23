const { classRegistration } = require("../Controllers/ClassRegistration");

const Router = require("express").Router();

Router.get("/", classRegistration);
module.exports = Router;
