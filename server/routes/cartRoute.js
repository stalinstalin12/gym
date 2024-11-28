const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


router.post('/addCart',cartController.addToCart);
router.get('/viewCart', cartController.getCart);

module.exports = router;