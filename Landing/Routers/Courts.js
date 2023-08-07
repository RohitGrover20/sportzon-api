const { getCourtByVenue } = require("../Controllers/Courts");

const Router = require("express").Router();
Router.get("/:venueId", getCourtByVenue);
module.exports = Router;