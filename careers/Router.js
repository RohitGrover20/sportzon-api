const { addJob , getJobs} = require("./Controller");
const Router = require("express").Router();
const {
  checkToken,
  writeAccess,
  readAcces,
  checkCareer,
} = require("../Middleware");

Router.post(
  "/",
  checkToken,
  checkCareer,
  writeAccess,
  addJob
);

Router.get("/", checkToken, checkCareer, readAcces, getJobs);

module.exports = Router;
