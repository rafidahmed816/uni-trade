const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true },        // e.g., "Books", "Electronics", "Services"
  subcategory: String,                                // optional
  condition: {                                        // condition of item/service
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  priceType: {                                        // price model: fixed, bidding, hourly
    type: String,
    enum: ['Fixed', 'Bidding', 'Hourly'],
    default: 'Fixed',
  },
  price: Number,                                      // for fixed price or starting bid
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visibility: {                                       // visibility mode
    type: String,
    enum: ['University', 'All'],
    default: 'University',
  },
  university: String,                                 // seller's university, for filtering
  images: [String],                                   // URLs or file paths
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,                                    // optional expiry date
});

module.exports = mongoose.model('Listing', listingSchema);
