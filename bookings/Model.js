const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    bookingId: { type: String, required: true },
    orderId: { type: String, required: true },
    bookingType: { type: String, required: true, enum: ["event", "arena"] },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: () => {
        this.bookingType == "event" ? true : false;
      },
    },
    eventDate: { type: String, required: true },
    title: { type:String , required: true},
    arena: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Arena",
      required: () => {
        this.bookingType == "arena" ? true : false;
      },
    },
    arenaBookingDate: {
      type: String,
      required: () => {
        this.bookingType == "arena" ? true : false;
      },
    },
    court: {
      type: Array,
      required: () => {
        this.bookingType == "arena" ? true : false;
      },
      default: [],
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true, default: "9999999999" },
    gender: { type: String },
    members: { type: Array },
    address: { type: String, required: true, default: "unavailable" },
    city: { type: String, default: "unavailable" },
    state: { type: String, default: "unavailable" },
    pincode: { type: Number, default: 0 },
    noOfTickets: { type: Number, required: true, default: 1 },
    eventStatus: {
      type: String,
      required: () => {
        this.bookingType == "event" ? true : false;
      },
      eval: [
        "completed",
        "cancelled",
        "upcoming",
        "unsuccessful",
        "unavailable",
      ],
      default: "unavailable",
    },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  },
  { collection: "bookings", timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = { Booking };
