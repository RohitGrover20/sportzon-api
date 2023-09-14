const {
  checkToken,
  readAcces,
  checkStudent,
  writeAccess,
  upadateAccess,
} = require("../Middleware");
const { addFees, feesOfStudentInClass, Editfees } = require("./Controller");

const Router = require("express").Router();

Router.get(
  "/:class/:student",
  checkToken,
  checkStudent,
  readAcces,
  feesOfStudentInClass
);
Router.post("/edit", checkToken, checkStudent, upadateAccess, Editfees);
Router.post("/", checkToken, checkStudent, writeAccess, addFees);

module.exports = Router;
