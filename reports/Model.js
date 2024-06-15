const mongoose = require("mongoose");

const ReportSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    banner: { type:String  , require: true},
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classes",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    grade: {type:String, require:true},
    month: { type: String, require: true },
    balance: {type:String, require:true},
    flexibility: {type:String, require:true},
    lowerStrength: {type:String },
    upperStrength: {type:String },
    abdominalStrength: { type: String },
    aerobicCapacity: { type: String },
    anerobicCapacity: { type: String },
    physicalAttributes: { type: String, required: true },
    psychologicalAttributes: { type: String, required: true },
    tacticalSkills: { type: String},
    technicalSkills: { type: String, required: true },
    reactionTime: { type: String, required: true },
    reportPdf: { type: String },
    attendence: { type: Number, required: true },
    // recommendation: { type: String, required: true },
    socialCompetency: { type: String, required: true},
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  },
  { collection: "reports", timestamps: true }
);

const Reports = mongoose.model("Report", ReportSchema);
module.exports = Reports;
