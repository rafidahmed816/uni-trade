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

router.get('/:id/image/:idx', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const img = listing.images[req.params.idx];
    if (!img) return res.status(404).send('Not found');
    res.set('Content-Type', img.contentType);
    res.send(img.data);
  } catch {
    res.status(404).send('Not found');
  }
});

router.get('/:id/image/:idx/base64', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const img = listing.images[req.params.idx];
    if (!img) return res.status(404).send('Not found');
    const base64 = img.data.toString('base64');
    res.json({ url: `data:${img.contentType};base64,${base64}` });
  } catch {
    res.status(404).send('Not found');
  }
});

module.exports = router;
