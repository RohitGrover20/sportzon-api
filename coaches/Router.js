const {
  checkToken,
  checkCoaches,
  writeAccess,
  readAcces,
} = require("../Middleware");
const { addCoach, getCoaches } = require("./Controller");

const Router = require("express").Router();

Router.post("/", checkToken, checkCoaches, writeAccess, addCoach);
Router.get("/", checkToken, checkCoaches, readAcces, getCoaches);

module.exports = Router;
