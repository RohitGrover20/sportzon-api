const { checkToken, checkUser, writeAccess, readAcces } = require("../Middleware");
const { addUser, login, getUser } = require("./Controller");

const Router = require("express").Router();

Router.post("/login", login);
Router.post("/", checkToken, checkUser, writeAccess, addUser);
Router.get("/", checkToken, checkUser, readAcces, getUser);
module.exports = Router;