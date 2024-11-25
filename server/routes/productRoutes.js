const express=require('express');
const router=express.Router();
const productController=require('../controllers/productController');
const{set}=require('mongoose');
const accessControl=require('../utils/access-control').accessControl;

function setaccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}

router.post('/product',setaccessControl('3'),productController.addProduct);
router.get('/products',setaccessControl('*'),productController.viewProducts);
module.exports=router;