const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { "collection": "payments", timestamps: true });


const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;