const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const{set}=require('mongoose');
const accessControl=require('../utils/access-control').accessControl;

function setaccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}

router.post('/createOrder',setaccessControl('2,3'),orderController.createOrder);
router.get('/viewOrders',orderController.viewUserOrders);
router.get('/viewAllOrders',orderController.viewAllOrders);


module.exports = router;