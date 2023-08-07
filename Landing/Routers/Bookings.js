const { checkSession } = require("../../Middleware");
const { myBookings } = require("../Controllers/Bookings");


const Router = require("express").Router();
Router.get("/", checkSession, myBookings);
module.exports = Router;