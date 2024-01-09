const { checkSession, checkToken } = require("../../Middleware");
const { AddRating, averageRating } = require("../Controllers/Rating");

const Router = require("express").Router();
Router.post("/get", averageRating);
Router.post("/mob", checkToken, AddRating);
Router.post("/", checkSession, AddRating);
module.exports = Router;
