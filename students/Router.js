const {
  checkToken,
  checkStudent,
  writeAccess,
  readAcces,
} = require("../Middleware");
const { getStudentsInAClass, AddStudent } = require("./Controller");

const Router = require("express").Router();

Router.post("/add", checkToken, checkStudent, writeAccess, AddStudent);
Router.get(
  "/:classes",
  checkToken,
  checkStudent,
  readAcces,
  getStudentsInAClass
);
module.exports = Router;
