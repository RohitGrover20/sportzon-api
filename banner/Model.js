const mongoose = require("mongoose");

const bannerSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    file: { type: String, required: true },
    url: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Homepage banner",
        "Category banner",
        "Product banner",
        "Promotional banner",
        "Testimonial banner",
        "Newsletter banner",
        "Social media banner",
        "Call to action banner",
      ],
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "status"],
    },
  },
  { collection: "banners", timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;
