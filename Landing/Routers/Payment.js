const { checkSession, checkToken, checkStudent } = require("../../Middleware");
const { Orders, failedPayment, RecentTransaction } = require("../Controllers/Payment");

const Router = require("express").Router();
Router.post("/orders/mob", checkToken, checkStudent, Orders);
Router.post("/orders", checkSession, Orders);
Router.post("/failed-payment/mob", checkToken, checkStudent, failedPayment);
Router.post("/failed-payment", checkSession, failedPayment);
Router.get("/recent-transactions/mob", checkToken, checkStudent, RecentTransaction);
Router.get("/recent-transactions", checkSession, RecentTransaction);
module.exports = Router;