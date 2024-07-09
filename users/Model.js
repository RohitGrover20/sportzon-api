const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true },
    userOtp: { type: Number, default: null },
    OtpVerified: { type: Boolean, default: false },
    isVerified: { type: Boolean, required: true, default: false },
    profile: { type: String },
    email: { type: String },
    password: { type: String, required: true },
    gender: { 
      type: String, 
      enum: ["Male", "Female"],
      set: v => v.toLowerCase()  // Normalize gender to lowercase
    },    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  },
  { collection: "users", timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
