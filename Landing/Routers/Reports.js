const { checkSession, checkToken } = require("../../Middleware");
const { myReports } = require("../Controllers/Reports");

const Router = require("express").Router();
Router.get("/:class/:student/mob", checkToken, myReports);
Router.get("/:class/:student", checkSession, myReports);
module.exports = Router;
