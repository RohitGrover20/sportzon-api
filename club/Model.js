const mongoose = require('mongoose');

const clubSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    logo: { type: String, required: true },
}, { "collection": "clubs", timestamps: true });


const Club = mongoose.model("Club", clubSchema);
module.exports = Club;