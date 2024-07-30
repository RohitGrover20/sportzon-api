const { checkSession, checkToken } = require("../../Middleware");
const { myFees, FeePayment } = require("../Controllers/Fees");

const Router = require("express").Router();
Router.get("/:class/:student/mob", checkToken, myFees);
Router.get("/:class/:student", checkSession, myFees);
Router.post("/pay-fees", checkSession, FeePayment);
module.exports = Router;
