const express=require('express');
const router=express.Router();
const productController=require('../controllers/productController');

router.post('/product',productController.addProduct);
router.get('/products',productController.viewProducts);
module.exports=router;