const mongoose = require("mongoose");

const EventSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    address: { type: String, required: true },
    activity: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventEndDate: {type: Date , required: true},
    eventTime: { type: Object, required: true },
    eventType: { type: String, required: true },
    isPrizeIncluded: { type: Boolean, required: true },
    prize: {
      type: Number,
      required: () => {
        this.isPrizeIncluded == true ? true : false;
      },
    },
    entryFees: { type: Number, required: true },
    memberType: { type: String, required: true, eval: ["team", "individual"] },
    memberLimit: {
      type: Number,
      required: () => {
        this.memberType == "team" ? true : false;
      },
    },
    totalSlots: { type: Number, required: true },
    ticketSystem: { type: Boolean, required: true },
    emptySlots: {
      type: Number,
      required: true,
      default: () => this.totalSlots,
    },
    description: { type: String, required: true },
    banner: { type: String, required: true },
    status: { type: String, required: true, enum: ["active", "inactive"] },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  },
  { collection: "events", timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
