const Router = require("express").Router();
const { getBanner } = require("../Controllers/Banner");

Router.get("/", getBanner)
module.exports = Router;