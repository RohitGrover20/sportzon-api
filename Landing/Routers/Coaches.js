const { getCoachbyId } = require("../Controllers/Coaches");

const Router = require("express").Router();
Router.get("/:coachId", getCoachbyId);
module.exports = Router;
