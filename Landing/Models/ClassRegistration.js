const mongoose = require("mongoose");

const classRegistrationSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    fullName: { type: String, required: true },
    mobile: { type: Number, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true, enum: ["male", "female"] },
    priorExperience: { type: Boolean, required: true },
    medicalCondition: { type: Boolean, required: true },
  },
  { collection: "classRegistration", timestamps: true }
);

const ClassRegistration = mongoose.model(
  "ClassRegistration",
  classRegistrationSchema
);
module.exports = ClassRegistration;
