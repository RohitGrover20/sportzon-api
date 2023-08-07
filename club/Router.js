const { addClub, getClub } = require("./Controller");
const { checkToken, checkClub, writeAccess, readAcces } = require("../Middleware");
const Router = require("express").Router();
Router.post("/", checkToken, checkClub, writeAccess, addClub);
Router.get("/", checkToken, checkClub, readAcces, getClub);

module.exports = Router;