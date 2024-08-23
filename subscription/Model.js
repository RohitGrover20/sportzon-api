const mongoose = require('mongoose');

// Define Schema
const subscriptionSchema = new mongoose.Schema({
  planName: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  features: [
    {
      description: { type: String, required: true },
      details: { type: String },
    },
  ],
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
