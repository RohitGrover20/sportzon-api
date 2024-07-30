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
    totalPayableAmount: { type: Number },
    feeWithGst: { type: Number, required: true },
    previousBalance: { type: Number },
    discount: { type: Number, required: true, default: 0 },
    gst: { type: Number, required: true, default: 0 },
    feeWithoutGst: { type: Number, required: true, default: 0 },
    paidAmount: { type: Number, required: true, default: 0 },
    remainingBalance: { type: Number, required: true, default: 0 },
    month: { type: String },
    year: { type: String },
    description: { type: String },
    paymentType: { type: String, required: true },
    feeDate: { type: String, required: true },
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
