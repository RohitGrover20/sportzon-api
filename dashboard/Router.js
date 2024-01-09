const Router = require("express").Router();
const { getDashboard } = require("./Controller");
const { checkToken , readAcces, checkDashboard } = require("../Middleware");

Router.get("/", checkToken , checkDashboard ,readAcces, getDashboard);

module.exports = Router;

