const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    bookingId: { type: String, required: true },
    orderId: { type: String, required: true },
    bookingType: { type: String, required: true, enum: ["event", "arena"] },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: () => { this.bookingType == "event" ? true : false }, default: null },
    arena: { type: mongoose.Schema.Types.ObjectId, ref: "Arena", required: () => { this.bookingType == "arena" ? true : false }, default: null },
    arenaBookingDate: { type: String, required: () => { this.bookingType == "arena" ? true : false } },
    court: { type: mongoose.Schema.Types.ObjectId, ref: "Court", required: () => { this.bookingType == "arena" ? true : false }, default: null },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number, required: true },
    gender: { type: String, required: true, eval: ["male", "female", "other"] },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    // invoice: { type: String, required: () => { this.paymentStatus == "paid" ? true : false } },
    noOfTickets: { type: Number, required: true, default: 1 },
    // paymentStatus: { type: String, required: true, eval: ["paid", "failed", "processing"] },
    status: { type: String, required: true, eval: ["completed", "cancelled", "upcoming", "unsuccessful"] },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
}, { "collection": "bookings", timestamps: true });


const Booking = mongoose.model("Booking", bookingSchema);
module.exports = { Booking };