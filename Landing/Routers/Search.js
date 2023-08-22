const { Search } = require("../Controllers/Search");
const Router = require("express").Router();
Router.get("/", Search);
module.exports = Router;
