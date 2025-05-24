const express = require('express');
const router = express.Router();
const middleware= require('../middleware/authMiddleware');
const { createListing, getListings } = require('../controllers/listingController');

router.post('/',middleware, createListing);
router.get('/', getListings);

module.exports = router;
