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
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userDetails: { type: Object, required: true },
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
