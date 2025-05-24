
const Listing = require('../models/Listing');

exports.createListing = async (req, res) => {
  try {
    const listingData = {
      ...req.body,
      seller: req.user.id,
      university: req.user.university,
    };

    const listing = new Listing(listingData);
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create listing" });
  }
};

exports.getListings = async (req, res) => {
  try {
    // Filters from query parameters
    const { category, priceMin, priceMax, condition, university, visibility, search, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    if (university) filter.university = university;
    if (visibility) filter.visibility = visibility;

    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const listings = await Listing.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (err) {
    res.status(500).json({ msg: "Failed to get listings" });
  }
};
