const mongoose = require('mongoose');
const slotSchema = new mongoose.Schema({
    startTime: { type: String, required: true },  // Start time of the slot
    endTime: { type: String, required: true }  ,   // End time of the slot
    price: { type: Number }  
});

const courtSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    activity: { type: String, required: true },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club", required: true },
    arena: { type: mongoose.Schema.Types.ObjectId, ref: "Arena", required: true },
    slots: {
        monday: { type: [slotSchema] },
        tuesday: { type: [slotSchema] },
        wednesday: { type: [slotSchema] },
        thursday: { type: [slotSchema]},
        friday: { type: [slotSchema]},
        saturday: { type: [slotSchema]},
        sunday: { type: [slotSchema]},
    },
    pricing: {
        monday: { type: Number },
        tuesday: { type: Number },
        wednesday: { type: Number},
        thursday: { type: Number},
        friday: { type: Number },
        saturday: { type: Number },
        sunday: { type: Number },
    }
}, { collection: "courts", timestamps: true });

const Court = mongoose.model("Court", courtSchema);
module.exports = Court;
