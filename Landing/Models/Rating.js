const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    rating: { type: Number, required: true },
    user: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["Arena", "Class"],
    },
    arena: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Arena",
      required: () => {
        this.type == "Arena" ? true : false;
      },
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classes",
      required: () => {
        this.type == "Class" ? true : false;
      },
    },
  },
  { collection: "ratings", timestamps: true }
);

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
