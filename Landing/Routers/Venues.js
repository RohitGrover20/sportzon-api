const { getVenueBySlug, getVenues } = require("../Controllers/Venues");

const Router = require("express").Router();
Router.get("/:slug", getVenueBySlug);
Router.get("/", getVenues);
module.exports = Router;