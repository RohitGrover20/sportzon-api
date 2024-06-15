const mongoose = require("mongoose");

const classSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    fees: { type: Number, required: true },
    duration: { type: Number, required: true },
    feesFrequency: {
      type: String,
      required: true,
      enum: ["monthly", "yearly", "oneTime", "quarterly"],
    },
    description: { type: String, required: true },
    classTiming: { type: Array, required: true },
    classType: { type: String, required: true },
    coaches: {
      type: Array,
      required: true,
    },
    amenities: { type: Array, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    rating: {
      type: String,
      default: "Rating is not available",
    },
    pincode: { type: Number, required: true },
    address: { type: String, required: true },
    banner: { type: String, required: true },
    activity: { type: String, required: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  },
  { collection: "classes", timestamps: true }
);

const Classes = mongoose.model("Classes", classSchema);
module.exports = Classes;
