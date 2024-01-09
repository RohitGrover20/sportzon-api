const mongoose = require("mongoose");

const FeesSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classes",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subtotal: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
    gst: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    paidAmount: { type: Number, required: true, default: 0 },
    balance: { type: Number, required: true, default: 0 },
    month: { type: String, required: true },
    year: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      required: true,
      enum: ["paid", "waived", "refunded"],
    },
    paidOn: { type: Date, required: true },
    paymentMethod: { type: String },
    transactionId: { type: String },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  },
  { collection: "fees", timestamps: true }
);

const Fees = mongoose.model("Fees", FeesSchema);
module.exports = Fees;
