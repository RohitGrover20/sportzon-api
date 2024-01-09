const { checkSession, checkToken } = require("../../Middleware");
const {
  Orders,
  failedPayment,
  RecentTransaction,
} = require("../Controllers/Payment");

const Router = require("express").Router();
Router.post("/orders/mob", checkToken, Orders);
Router.post("/orders", checkSession, Orders);
Router.post("/failed-payment/mob", checkToken, failedPayment);
Router.post("/failed-payment", checkSession, failedPayment);
Router.get("/recent-transactions/mob", checkToken, RecentTransaction);
Router.get("/recent-transactions", checkSession, RecentTransaction);
module.exports = Router;
