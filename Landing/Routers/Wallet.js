const { checkSession } = require("../../Middleware");
const { VerifyPayment } = require("../Controllers/Payment");
const {
  getTotalCoins,
  getUserWalletHistory,
  deductCoins,
  handleWalletRecharge
} = require("../Controllers/Wallet");
const Router = require("express").Router();

// Route to get total coins for a user
Router.get("/:userId/total-coins", checkSession, getTotalCoins);
Router.get("/", checkSession, getUserWalletHistory);
Router.post("/deduct-coins" , checkSession , deductCoins);
Router.post("/process", checkSession, VerifyPayment , handleWalletRecharge);
module.exports = Router;
