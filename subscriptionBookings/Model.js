const mongoose = require("mongoose");

const subscriptionbookingSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    bookingId: { type: String, required: true },
    orderId: { type: String },
    planName: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    amount: {type:Number},
    // subscription: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Subscription",
    //   required: true
    // },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // firstName: { type: String, required: true },
    // email: { type: String },
    // mobile: { type: String, required: true, default: "9999999999" },
    // gender: { type: String },
    // address: { type: String, required: true, default: "unavailable" },
    // city: { type: String, default: "unavailable" },
    // state: { type: String, default: "unavailable" },
    userDetails: { type: Object, required: true },
    // pincode: { type: Number, default: 0 },
    staus: {
      type: String,
      required: true,
      eval: [
        "Completed",
        "cancelled",
        "upcoming",
        "unsuccessful",
        "unavailable",
      ],
      default: "Completed",
    },
    // club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  },
  { collection: "SubscriptionBooking", timestamps: true }
);

const SubscriptionBooking = mongoose.model(
  "SubscriptionBooking",
  subscriptionbookingSchema
);
module.exports = { SubscriptionBooking };
