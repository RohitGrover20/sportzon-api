const { checkToken, checkCourts, readAcces, writeAccess } = require("../Middleware");
const { addCourt, getCourtinArena } = require("./Controller");

const Router = require("express").Router();

Router.post("/get-courts-in-arena", checkToken, checkCourts, readAcces, getCourtinArena)
Router.post("/", checkToken, checkCourts, writeAccess, addCourt)

module.exports = Router;