// routes/wallet.js
const express = require("express");
const router = express.Router();
const Wallet = require("../../creditwallet/Model");
const Payment = require("../Models/Payments");
module.exports = {
  getTotalCoins: async (req, res) => {
    try {
      const userId = req?.params?.userId;

      // Query to find transactions for the user
      const transactions = await Wallet.find({ userId }).select("type amount");

      // Calculate total coins
      const totalCoins = transactions.reduce((acc, transaction) => {
        if (transaction.type === "credit" || transaction.type === "recharge") {
          return acc + transaction.amount;
        } else if (transaction.type === "debit") {
          return acc - transaction.amount;
        }
        return acc;
      }, 0);

      return res.status(200).json({
        data: { totalCoins },
        message: "Total coins were calculated",
        code: "success",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        data: err,
        message: "Error occurred while calculating total coins",
        code: "error",
      });
    }
  },
  getUserWalletHistory: async (req, res) => {
    try {
      // Assuming req.user is populated by your authentication middleware
      const userId = req?.user?._id;

      // Query to find all transactions for the user, with performance optimization
      const walletHistory = await Wallet.find({ userId })
        .sort({ date: -1 })
        .lean(); // Use lean() to improve performance

      if (walletHistory?.length === 0) {
        return res.status(404).json({
          message: "No wallet history found for this user.",
          code: "not_found",
        });
      }

      return res.status(200).json({
        data: walletHistory,
        message: "User wallet history retrieved successfully.",
        code: "success",
      });
    } catch (err) {
      console.error("Error fetching wallet history:", err.message);
      return res.status(500).json({
        message: "Error occurred while fetching wallet history.",
        code: "error",
      });
    }
  },
  deductCoins: async (req, res) => {
    try {
      // Get the userId from the authenticated user
      const userId = req?.user._id; // Assuming req.user is populated by your authentication middleware
      const { amount } = req.body;
  
      // Validate the amount
      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
          message: "Invalid amount",
          code: "error",
        });
      }
  
      // Find the wallet for the user
      const wallet = await Wallet.findOne({ userId });
  
      if (!wallet) {
        return res.status(404).json({
          message: "Wallet not found for this user",
          code: "error",
        });
      }
  
      // Check if the user has enough coins
      const currentBalance = wallet.coins;
      if (currentBalance < amount) {
        return res.status(400).json({
          message: "Insufficient balance",
          code: "error",
        });
      }
  
      // Deduct coins
      wallet.coins -= amount;
      await wallet.save();
  
      // Record the transaction
      await Wallet.create({
        userId,
        type: "debit",
        amount,
        description: "Coins deducted for payment",
        date: new Date(),
        club : req?.user?.club,
      });
  
      return res.status(200).json({
        data: { remainingCoins: wallet.coins },
        message: "Coins deducted successfully",
        code: "success",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        data: err,
        message: "Error occurred while deducting coins",
        code: "error",
      });
    }
  },
  handleWalletRecharge : async(req, res) =>{
    const amount = req?.body?.amount;
    const result = Number(
        ((amount) * (10 /100) + amount).toFixed(0)
      );

    try {
      const payment = await Payment.create({
        user: req.user._id,
        razorpay_order_id: req?.body?.response?.razorpay_order_id,
        razorpay_payment_id: req?.body?.response?.razorpay_payment_id,
        razorpay_signature: req?.body?.response?.razorpay_signature,
        status: "paid",
      });

      // Create a Recharge document
      const rechargeData = {
        ...req.body.data,
        user: req.user,
        orderId: req?.body?.response?.razorpay_order_id,
        club: req?.user?.club,
        status: "Completed",
      };
      // Create a new wallet transaction entry
      const walletEntry = new Wallet({
        userId: req.user._id,
        user: req.user,
        type: "recharge",
        amount: result,
        money: amount,
        club: req?.user?.club, // Assuming the subscription is linked to a club
        description: `Your wallet has been successfully recharged with coins! `,
      });
      await walletEntry.save();
    //   await sendSubscriptionEmail(req?.user?.email, subscriptionData);
    //   await sendSubscriptionSMS(req?.user?.mobile, subscriptionData);

    //   // Return the booking data in the response
      return res.status(200).json({
        code: "booked",
        message: "Your wallet has been successfully recharged!",
        data: [],
      });
    } catch (error) {
      console.error("Error processing booking:", error);
      return res.status(400).json({
        code: "error",
        message: "Something went wrong. Please try again",
        data: error.message,
      });
    }
  },
  
};