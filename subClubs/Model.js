const mongoose = require("mongoose");

const subclubSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    clubIn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    logo: { type: String, required: true },
  },
  { collection: "subclubs", timestamps: true }
);

const subClub = mongoose.model("subClub", subclubSchema);
module.exports = subClub;
