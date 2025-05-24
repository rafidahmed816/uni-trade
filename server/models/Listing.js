const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true },          // e.g., Books, Electronics, Services
  subcategory: String,
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    default: 'Good',
  },
  listingType: {
    type: String,
    enum: ['Single', 'Bundle', 'Digital', 'Recurring'],
    default: 'Single',
  },
  bundleItems: [{                                        // For bundle listings
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
  }],
  priceType: {
    type: String,
    enum: ['Fixed', 'Bidding', 'Hourly'],
    default: 'Fixed',
  },
  price: Number,
  reservePrice: Number,                                 // Minimum bid price (for bidding)
  buyNowPrice: Number,                                 // Instant buy price (optional)
  discountCode: String,                                // Optional coupon/discount code
  paymentTerms: String,                                // e.g., 'Installments allowed'
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visibility: {
    type: String,
    enum: ['University', 'All', 'CustomGroups'],
    default: 'University',
  },
  customGroups: [String],                              // Array of group IDs or names (if CustomGroups)
  university: String,
  geofenceRadius: Number,                              // in meters (for geofencing)
  anonymized: { type: Boolean, default: false },       // Hide seller identity
  verifiedListing: { type: Boolean, default: false },  // Badge for verified listings
  images: [String], 
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  recurringInterval: String,                           // e.g., 'Weekly', 'Monthly' for recurring services
  viewsCount: { type: Number, default: 0 },            // For popularity sorting
  rating: { type: Number, default: 0 },                // Average seller rating (can be calculated)
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  address: String,
});

module.exports = mongoose.model('Listing', listingSchema);
