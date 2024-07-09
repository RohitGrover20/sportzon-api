const {
  checkToken,
  readAcces,
  checkStudent,
  writeAccess,
  upadateAccess,
  checkStudentFees,
} = require("../Middleware");
const { addFees, feesOfStudentInClass, Editfees } = require("./Controller");

const Router = require("express").Router();

Router.get(
  "/:class/:student",
  checkToken,
  checkStudentFees,
  readAcces,
  feesOfStudentInClass
);
Router.post("/edit", checkToken, checkStudentFees, upadateAccess, Editfees);
Router.post("/", checkToken, checkStudentFees, writeAccess, addFees);

module.exports = Router;
