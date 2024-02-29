const mongoose = require("mongoose");

const AffiliateSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    startdate: { type: String, required: true },
    enddate: { type: String, required: true },
    type: { type: String, required: true },
    code: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: true },
  },
  { collection: "affiliate", timestamps: true }
);

const Affiliate = mongoose.model("Affiliate", AffiliateSchema);
module.exports = Affiliate;
