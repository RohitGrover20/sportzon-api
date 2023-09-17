const {
  checkToken,
  checkRole,
  writeAccess,
  readAcces,
  upadateAccess,
} = require("../Middleware");
const { addRole, getRole, EditRole } = require("./Controller");

const Router = require("express").Router();
Router.post("/edit", checkToken, checkRole, upadateAccess, EditRole);
Router.post("/", checkToken, checkRole, writeAccess, addRole);
Router.get("/", checkToken, checkRole, readAcces, getRole);
module.exports = Router;
