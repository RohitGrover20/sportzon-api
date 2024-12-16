const Router = require("express").Router();
const { Jobs} = require("../Controllers/Career");
Router.get("/", Jobs);
module.exports = Router;