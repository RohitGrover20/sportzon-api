const { getVenueBySlug, getVenues, arenaSlotChecking } = require("../Controllers/Venues");

const Router = require("express").Router();
Router.get("/:slug", getVenueBySlug);
Router.post("/get-slots", arenaSlotChecking);
Router.get("/", getVenues);
module.exports = Router;