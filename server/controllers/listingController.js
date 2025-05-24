const Listing = require('../models/Listing');

// Create listing with new fields supported
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
    console.error(err);
    res.status(500).json({ msg: "Failed to create listing" });
  }
};

// Get listings with filtering and sorting options
exports.getListings = async (req, res) => {
  try {
    const {
      category,
      priceMin,
      priceMax,
      condition,
      university,
      visibility,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',       // e.g., 'createdAt', 'price', 'viewsCount', 'rating'
      sortOrder = 'desc'          // 'asc' or 'desc'
    } = req.query;

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

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const listings = await Listing.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort(sortOptions);

    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to get listings" });
  }
};
