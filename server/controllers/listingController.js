const cloudinary = require('../config/cloudinary');
const Listing = require('../models/Listing');
const multer = require('multer');
const fs = require('fs');

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// CREATE a new listing
exports.createListing = [
  upload.array('images', 5), // Accept up to 5 images
  async (req, res) => {
    try {
      const imageUrls = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'uni-trade-listings',
        });
        imageUrls.push(result.secure_url);
        fs.unlinkSync(file.path); // Remove file after upload
      }

      const listingData = {
        ...req.body,
        seller: req.user.id,
        university: req.user.university,
        images: imageUrls,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      };

      const listing = new Listing(listingData);
      await listing.save();
      res.status(201).json(listing);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Failed to create listing" });
    }
  }
];

// READ: Get all listings with filtering, sorting, and pagination
exports.getListings = async (req, res) => {
  try {
    const { search, category, university, minPrice, maxPrice, condition } = req.query;
    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (category) filter.category = category;
    if (university) filter.university = university;
    if (condition) filter.condition = condition;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(filter).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ: Get a single listing by ID
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name university'); // Add fields you want from seller
      
    if (!listing) {
      return res.status(404).json({ msg: "Listing not found" });
    }
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to get listing" });
  }
};

// UPDATE a listing by ID
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ msg: "Listing not found" });

    // Optional: Only allow the seller to update their own listing
    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    Object.assign(listing, req.body);
    await listing.save();
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update listing" });
  }
};

// DELETE a listing by ID
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ msg: "Listing not found" });

    // Optional: Only allow the seller to delete their own listing
    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await listing.deleteOne();
    res.json({ msg: "Listing deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete listing" });
  }
};

// Validate location coordinates middleware
exports.validateLocation = (req, res, next) => {
  if (!req.body.location || !req.body.location.coordinates) {
    return res.status(400).json({ msg: "Location is required." });
  }
  next();
};
