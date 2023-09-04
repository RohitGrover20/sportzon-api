const mongoose = require("mongoose");

const ReportSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
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
    month: { type: String, require: true },
    tacticalAwareness: { type: Object, required: true },
    physicalFitness: { type: Object, required: true },
    gamePerformance: { type: Object, required: true },
    teamWork: { type: Object, required: true },
    reportPdf: { type: String },
    attendence: { type: Number, required: true },
    recommendation: { type: String, required: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  },
  { collection: "reports", timestamps: true }
);

const Reports = mongoose.model("Report", ReportSchema);
module.exports = Reports;
