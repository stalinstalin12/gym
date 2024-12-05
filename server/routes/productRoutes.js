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

router.post('/product',setaccessControl('*'),productController.addProduct);
router.get('/products',setaccessControl('*'),productController.viewProducts);
router.get('/product/:id',setaccessControl('*'),productController.viewSingleProduct);
router.get('/products/user',productController.viewProductsByUser);
// Add a route to fetch products by category
router.get('/products/category/:category', setaccessControl('*'), productController.viewProductsByCategory);

module.exports=router;