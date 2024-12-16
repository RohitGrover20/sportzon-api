const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    state: { type: String, required: true },
    city:{ type: String , required: true},
    description : { type:String , required: true},
    url : {type:String , required: true},
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
  },
  { collection: "job", timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
