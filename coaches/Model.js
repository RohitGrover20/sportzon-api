const mongoose = require("mongoose");

const coachSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    qualification: { type: String, required: true },
    certification: { type: Array, required: true },
    experience: { type: Number, required: true },
    expertise: { type: Array, required: true },
    testimonials: { type: Array },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  },
  { collection: "coaches", timestamps: true }
);

const Coach = mongoose.model("Coach", coachSchema);
module.exports = Coach;
