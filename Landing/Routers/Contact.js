const { sendEmail, offeringEmail } = require("../Controllers/Contact");

const Router = require("express").Router();
Router.post("/offering", offeringEmail);
Router.post("/", sendEmail);
module.exports = Router;
