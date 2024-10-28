const mongoose = require("mongoose");

const ArenaSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    rating: { type: String, default: "Rating is not available" },
    address: { type: String, required: true },
    timing: { type: Object, required: true },
    amenities: { type: Array, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    activities: { type: Array, required: true },
    description: { type: String, required: true },
    gallery: { type: Array, required: true },
    agreement: { type: String },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  },
  { collection: "arenas", timestamps: true }
);

const Arena = mongoose.model("Arena", ArenaSchema);
module.exports = Arena;
