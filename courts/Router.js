const {
  checkToken,
  checkCourts,
  readAcces,
  writeAccess,
  upadateAccess,
} = require("../Middleware");
const { addCourt, getCourtinArena, EditCourt } = require("./Controller");

const Router = require("express").Router();

Router.post(
  "/get-courts-in-arena",
  checkToken,
  checkCourts,
  readAcces,
  getCourtinArena
);
Router.post("/edit", checkToken, checkCourts, upadateAccess, EditCourt);
Router.post("/", checkToken, checkCourts, writeAccess, addCourt);

module.exports = Router;
