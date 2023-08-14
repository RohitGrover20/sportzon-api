const { checkSession, checkToken, checkStudent } = require("../../Middleware");
const { myBookings, Process } = require("../Controllers/Bookings");
const { VerifyPayment } = require("../Controllers/Payment");


const Router = require("express").Router();
Router.post("/process/mob", checkToken, checkStudent, VerifyPayment, Process);
Router.post("/process", checkSession, VerifyPayment, Process);
Router.get("/mob", checkToken, checkStudent, myBookings);
Router.get("/", checkSession, myBookings);
module.exports = Router;