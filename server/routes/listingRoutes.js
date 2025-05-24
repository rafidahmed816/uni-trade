const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const auth = require('../middleware/authMiddleware');

// Create a new listing
router.post('/', auth, listingController.createListing);

// Get all listings
router.get('/', listingController.getListings);

// Get a single listing by ID
router.get('/:id', listingController.getListingById);

// Update a listing
router.put('/:id', auth, listingController.updateListing);

// Delete a listing
router.delete('/:id', auth, listingController.deleteListing);

module.exports = router;
