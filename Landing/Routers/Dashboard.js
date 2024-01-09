const { getDashboard } = require("../Controllers/Dashboard");
const Router = require("express").Router();

Router.get("/", getDashboard);
module.exports = Router;