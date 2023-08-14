const { checkSession, checkToken, checkStudent } = require("../../Middleware");
const { Orders } = require("../Controllers/Payment");

const Router = require("express").Router();
Router.post("/orders/mob", checkToken, checkStudent, Orders);
Router.post("/orders", checkSession, Orders);
// Router.post("/verify", checkSession, Verify);
module.exports = Router;