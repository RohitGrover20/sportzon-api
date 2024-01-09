const {
  checkToken,
  checkBooking,
  readAcces,
  writeAccess,
  upadateAccess,
} = require("../Middleware");
const {
  eventBooking,
  arenaBooking,
  addBooking,
  updateBooking,
} = require("./Controller");

const Router = require("express").Router();
Router.get("/events", checkToken, checkBooking, readAcces, eventBooking);
Router.get("/arenas", checkToken, checkBooking, readAcces, arenaBooking);
Router.post(
  "/update-booking",
  checkToken,
  checkBooking,
  upadateAccess,
  updateBooking
);
Router.post("/", checkToken, checkBooking, writeAccess, addBooking);

module.exports = Router;
