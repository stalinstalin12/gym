const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');


router.post('/addWishlist',wishlistController.addToWishlist);
router.get('/viewWishlist', wishlistController.getWishlist);
router.delete('/deleteWishlist/:id', wishlistController.removeFromWishlist);


module.exports = router;