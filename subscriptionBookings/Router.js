const {
    checkToken,
    checkBooking,
    readAcces,
    writeAccess
  } = require("../Middleware");
  const {
    addSubscriptionBooking,
    getAllSubscriptionMembers
  } = require("./Controller");
  
  const Router = require("express").Router();
  Router.get("/" , checkToken , checkBooking, readAcces , getAllSubscriptionMembers)
  Router.post("/", checkToken, checkBooking, writeAccess, addSubscriptionBooking);
  
  module.exports = Router;
  