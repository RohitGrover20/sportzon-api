const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    bookingId: { type: String, required: true },
    orderId: { type: String, required: true },
    bookingType: { type: String, required: true, enum: ["event", "arena"] },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: () => { this.bookingType == "event" ? true : false } },
    arena: { type: mongoose.Schema.Types.ObjectId, ref: "Arena", required: () => { this.bookingType == "arena" ? true : false } },
    arenaBookingDate: { type: String, required: () => { this.bookingType == "arena" ? true : false } },
    court: { type: Array, required: () => { this.bookingType == "arena" ? true : false }, default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true, default: "9999999999" },
    gender: { type: String},
    address: { type: String, required: true, default: "not-available" },
    city: { type: String, required: true, default: "not-available" },
    state: { type: String, required: true, default: "not-available" },
    pincode: { type: Number, required: true, default: 0 },
    noOfTickets: { type: Number, required: true, default: 1 },
    status: { type: String, required: true, eval: ["completed", "cancelled", "upcoming", "unsuccessful"] },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
}, { "collection": "bookings", timestamps: true });


const Booking = mongoose.model("Booking", bookingSchema);
module.exports = { Booking };