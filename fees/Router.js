const {
  checkToken,
  readAcces,
  checkStudent,
  writeAccess,
} = require("../Middleware");
const { addFees, feesOfStudentInClass } = require("./Controller");

const Router = require("express").Router();

Router.get(
  "/:class/:student",
  checkToken,
  checkStudent,
  readAcces,
  feesOfStudentInClass
);
Router.post("/", checkToken, checkStudent, writeAccess, addFees);

module.exports = Router;
