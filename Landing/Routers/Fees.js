const { checkSession, checkToken } = require("../../Middleware");
const { myFees } = require("../Controllers/Fees");

const Router = require("express").Router();
Router.get("/:class/:student/mob", checkToken, myFees);
Router.get("/:class/:student", checkSession, myFees);
module.exports = Router;
