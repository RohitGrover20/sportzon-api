const { checkSession } = require("../../Middleware");
const { myFees } = require("../Controllers/Fees");

const Router = require("express").Router();
Router.get("/:class/:student", checkSession, myFees);
module.exports = Router;
