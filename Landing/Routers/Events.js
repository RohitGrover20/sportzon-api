const { getEvents, getEventBySlug } = require("../Controllers/Events");
const Router = require("express").Router();
Router.get("/:slug", getEventBySlug);
Router.get("/", getEvents);
module.exports = Router;