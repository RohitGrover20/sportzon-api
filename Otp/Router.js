const Router = require("express").Router();
const { Otpsend, verifyOtp } = require("./Controller");

Router.post("/send", Otpsend);
Router.post("/verify", verifyOtp);

module.exports = Router;
