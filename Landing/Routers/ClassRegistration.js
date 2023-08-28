const { checkSession, checkToken } = require("../../Middleware");
const {
  classRegistration,
  checkRegistration,
  myRegisteredClasses,
} = require("../Controllers/ClassRegistration");

const Router = require("express").Router();
Router.get("/my-classes/mob", checkToken, myRegisteredClasses);
Router.get("/my-classes", checkSession, myRegisteredClasses);
Router.post("/check-registration/mob", checkToken, checkRegistration);
Router.post("/check-registration", checkSession, checkRegistration);
Router.post("/mob", checkToken, classRegistration);
Router.post("/", checkSession, classRegistration);
module.exports = Router;
