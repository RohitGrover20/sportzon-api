const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    parentName: {
      type: String,
      required: () => {
        this.age < 18 ? true : false;
      },
    },
    parentMobile: {
      type: String,
      required: () => {
        this.age < 18 ? true : false;
      },
    },
    parentEmail: { type: String },
    emergencyName: { type: String, required: true },
    emergencyMobile: { type: String, required: true },
    admissionIn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classes",
      required: true,
    },
    lastFeesPaidOn: { type: Date, required: true },
    classTiming: { type: Object, required: true },
    status: {
      type: String,
      required: true,
      enum: [
        "active", //This is the default status for students who are currently enrolled in classes and meeting all of their academic requirements.
        "graduated", //This status is given to students who have completed all of the requirements for their degree.
        "withdrawn", //This status is given to students who have left the school before completing their degree.
        "inactive", // This status is given to students who are not currently enrolled in classes, but who have not officially withdrawn from the school.
        "pending", //This status is given to students who have applied for admission or readmission to the school, but their status has not yet been finalized.
        "suspension", //This status is given to students who have violated the school's policies. They may be prohibited from attending classes or participating in extracurricular activities.
        "dismissal", //This is the most serious status, and it means that the student is no longer allowed to attend the school.
      ],
      default: "active",
    },
  },
  { collection: "students", timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
