const mongoose = require('mongoose');

// Define the schema for coin transactions
const userCoinsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coins: {
    type: Number,
    required: true,
    default: 0,
  },
  transactionType: {
    type: String,
    enum: ['credit', 'debit'],
    required: true,
  },
  description: {
    type: String,
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create and export the UserCoins model
module.exports = mongoose.model('UserCoins', userCoinsSchema);
