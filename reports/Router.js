const {
  checkToken,
  checkCoaches,
  writeAccess,
  readAcces,
  checkStudent,
  upadateAccess,
} = require("../Middleware");
const { addReport, getReportOfStudent, uploadReport } = require("./Controller");

const Router = require("express").Router();

Router.post(
  "/upload-report",
  checkToken,
  checkStudent,
  upadateAccess,
  uploadReport
);
Router.get(
  "/:class/:student",
  checkToken,
  checkCoaches,
  readAcces,
  getReportOfStudent
);
Router.post("/", checkToken, checkCoaches, writeAccess, addReport);

module.exports = Router;
