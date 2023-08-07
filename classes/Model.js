const mongoose = require("mongoose");

const classSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    fees: { type: Number, required: true },
    duration: { type: Number, required: true },
    feesFrequency: { type: String, required: true, enum: ["monthly", "yearly", "oneTime", "quarterly"] },
    description: { type: String, required: true },
    classTiming: { type: Object, required: true },
    coach: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amenities: { type: Array, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    address: { type: String, required: true },
    banner: { type: String, required: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
}, { "collection": "classes", timestamps: true });

const Classes = mongoose.Model("Classes", classSchema);
module.exports = Classes;