const mongoose = require('mongoose');

const courtSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    activity: { type: String, required: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
    arena: { type: mongoose.Schema.Types.ObjectId, ref: "Arena", required: true },
    slots: { type: Array, required: true },
    pricing: { type: Number, required: true },
}, { "collection": "courts", timestamps: true });


const Court = mongoose.model("Court", courtSchema);
module.exports = Court;