const { Search } = require("../Controllers/Search");
const Router = require("express").Router();
Router.post("/", Search);
module.exports = Router;
