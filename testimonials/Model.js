const mongoose = require("mongoose");

const testimonialSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    profile: { type: String, required: true },
    fullName: { type: String, required: true },
    designation: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required:"true"} // Link to user
  },
  { collection: "testimonials", timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
module.exports = Testimonial;
