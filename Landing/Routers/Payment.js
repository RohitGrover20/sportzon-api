const { checkSession } = require("../../Middleware");
const { Orders, Verify } = require("../Controllers/Payment");

const Router = require("express").Router();
Router.post("/orders", checkSession, Orders);
Router.post("/verify", checkSession, Verify);
module.exports = Router;