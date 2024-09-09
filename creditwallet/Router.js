const {
    checkToken,
    readAcces,
    checkBooking,
  } = require("../Middleware");
  const {getRechargeTransactions } = require("./Controller");
  
  const Router = require("express").Router();
  
  Router.get(
    "/recharge-details",
    checkToken,
    checkBooking,
    readAcces,
    getRechargeTransactions
  );
  
  module.exports = Router;
  