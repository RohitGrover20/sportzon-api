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
    fees_amount: { type: Number, required: true },
    fees_discount: { type: Number, required: true, default: 0 },
    fees_month: { type: String, required: true },
    fees_year: { type: String, required: true },
    fees_description: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["paid", "waived", "refunded"],
    },
    paidOn: { type: Date, required: true },
    paymentMethod: { type: String, required: "" },
    transactionId: { type: String, required: "" },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  },
  { collection: "fees", timestamps: true }
);

const Fees = mongoose.model("Fees", FeesSchema);
module.exports = Fees;
