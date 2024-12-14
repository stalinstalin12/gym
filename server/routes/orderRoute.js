const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.post('/createOrder',orderController.createOrder);
router.get('/viewOrders',orderController.viewUserOrders);
router.get('/viewAllOrders',orderController.viewAllOrders);


module.exports = router;