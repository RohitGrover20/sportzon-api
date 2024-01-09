const {
  checkToken,
  checkCoaches,
  writeAccess,
  readAcces,
  upadateAccess,
} = require("../Middleware");
const { addCoach, getCoaches, EditCoach } = require("./Controller");

const Router = require("express").Router();

Router.post("/edit", checkToken, checkCoaches, upadateAccess, EditCoach);
Router.post("/", checkToken, checkCoaches, writeAccess, addCoach);
Router.get("/", checkToken, checkCoaches, readAcces, getCoaches);

module.exports = Router;
