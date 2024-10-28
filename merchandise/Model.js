const mongoose = require("mongoose");

const MerchandiseSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: String, required: true },
    size: { type: Array, required: true },
    color: { type: Array, required: true },
    description: { type: String, required: true },
    gallery: { type: Array, required: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  },
  { collection: "Merchandise", timestamps: true }
);

const Merchandise = mongoose.model("Merchandise", MerchandiseSchema);
module.exports = Merchandise;
