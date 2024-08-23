const { checkSession, checkToken } = require("../../Middleware");
const { VerifyPayment } = require("../Controllers/Payment");
const { getSubscriptionPlan, SubscriptionProcess  , mySubscriptions} = require("../Controllers/Subscription");

const Router = require("express").Router();
Router.get("/subscription/mob", checkToken, getSubscriptionPlan);
Router.get("/", getSubscriptionPlan);
Router.post("/process/mob", checkToken, VerifyPayment, SubscriptionProcess);
Router.post("/process", checkSession, VerifyPayment, SubscriptionProcess);
Router.get("/mysubscriptions", checkSession , mySubscriptions );

module.exports = Router;