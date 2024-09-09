// models/Transaction.js
const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user:{type : Object },
    type: {
      type: String,
      enum: ["credit", "debit", "recharge"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    money: {
      type:Number
    },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", auto: true },
    description: String,
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", WalletSchema);
