const { checkToken, checkStudent } = require("../Middleware");
const { getStudentsInAClass } = require("./Controller");

const Router = require("express").Router();

Router.get("/:classes", checkToken, checkStudent, getStudentsInAClass);
module.exports = Router;
