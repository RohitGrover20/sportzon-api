const { checkSession, checkToken } = require("../../Middleware");
const { getClasses, getClassesBySlug } = require("../Controllers/Classes");

const Router = require("express").Router();
Router.get("/:slug", getClassesBySlug);
Router.get("/", getClasses);
module.exports = Router;
