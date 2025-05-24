const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createListing, getListings } = require('../controllers/listingController');

router.post('/', auth, createListing);
router.get('/', getListings);

module.exports = router;
