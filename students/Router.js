const {
  checkToken,
  checkStudent,
  writeAccess,
  readAcces,
  upadateAccess,
} = require("../Middleware");
const {
  getStudentsInAClass,
  AddStudent,
  EditStudent,
} = require("./Controller");

const Router = require("express").Router();

Router.post("/add", checkToken, checkStudent, writeAccess, AddStudent);
Router.post("/edit", checkToken, checkStudent, upadateAccess, EditStudent);
Router.get(
  "/:classes",
  checkToken,
  checkStudent,
  readAcces,
  getStudentsInAClass
);
module.exports = Router;
