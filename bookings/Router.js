const { checkToken, checkBooking, readAcces, writeAccess } = require("../Middleware");
const { eventBooking, arenaBooking, addBooking } = require("./Controller");

const Router = require("express").Router();
Router.get("/events", checkToken, checkBooking, readAcces, eventBooking);
Router.get("/arenas", checkToken, checkBooking, readAcces, arenaBooking);
Router.post("/", checkToken, checkBooking, writeAccess, addBooking);

module.exports = Router;