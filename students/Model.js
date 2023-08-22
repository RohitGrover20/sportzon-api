const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    user: { id: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    dateOfBirth: { type: Date, required: true },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
      required: true,
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coaches",
      required: true,
    },
    registrationDate: { type: Date, required: true },
    paid: { type: Boolean, required: true },
  },
  { collection: "students", timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
