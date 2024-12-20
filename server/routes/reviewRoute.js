const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');


router.post('/reviews',  reviewController.addReview);
router.get('/reviews/:productId', reviewController.getReviews);

module.exports = router;
