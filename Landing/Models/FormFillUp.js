const mongoose = require("mongoose");

const FormSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    referrer: {
      type: String,
      required: true,
      enum: ["contact", "corporate", "school"],
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { collection: "formfillups", timestamps: true }
);

const FormFillUp = mongoose.model("FormFillUp", FormSchema);
module.exports = FormFillUp;
