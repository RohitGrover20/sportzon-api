const { checkSession } = require("../../Middleware");
const { AddRating, averageRating } = require("../Controllers/Rating");

const Router = require("express").Router();
Router.post("/get", averageRating);
Router.post("/", checkSession, AddRating);
module.exports = Router;
