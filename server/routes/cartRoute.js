const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const{set}=require('mongoose');
const accessControl=require('../utils/access-control').accessControl;

function setaccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}

router.post('/addCart',setaccessControl('2,3'),cartController.addToCart);
router.get('/viewCart', cartController.getCart);
router.delete('/deleteCart/:id', cartController.deleteCart);
router.patch('/updateCartQuantity', cartController.updateCartQuantity);

module.exports = router;