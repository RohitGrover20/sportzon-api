const Router = require("express").Router();
const { Otpsend, verifyOtp } = require("./Controller");

Router.get("/send", Otpsend);
Router.get("/verify", verifyOtp);

module.exports = Router;
