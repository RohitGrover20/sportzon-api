const { checkSession, checkToken } = require("../../Middleware");
const {
  getClasses,
  getClassesBySlug,
  getClassesByCoach,
} = require("../Controllers/Classes");

const Router = require("express").Router();
Router.get("/coach/:coachId", getClassesByCoach);
Router.get("/:slug", getClassesBySlug);
Router.get("/", getClasses);
module.exports = Router;
