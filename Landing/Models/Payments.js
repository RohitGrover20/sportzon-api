const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, required: true },
  },
  { collection: "payments", timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
