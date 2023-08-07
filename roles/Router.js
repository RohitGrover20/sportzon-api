const { checkToken, checkRole, writeAccess, readAcces } = require("../Middleware");
const { addRole, getRole } = require("./Controller");

const Router = require("express").Router();

Router.post("/", checkToken, checkRole, writeAccess, addRole);
Router.get("/", checkToken, checkRole, readAcces, getRole)
module.exports = Router;