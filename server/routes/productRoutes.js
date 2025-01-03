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
router.get('/blockedproducts',setaccessControl('*'),productController.viewBlockedProducts);

router.get('/product/:id',setaccessControl('*'),productController.viewSingleProduct);
router.get('/products/user/:id',productController.viewProductsByUser);
router.get('/products/seller/:userId', productController.getProductsByUser);
router.get('/products/category/:category', productController.viewProductsByCategory);
router.put('/blockProduct/:id',setaccessControl('1') , productController.blockProduct);
router.put('/unblockProduct/:id',setaccessControl('1') , productController.unblockProduct);

router.put("/products/:productId", productController.updateProduct);
module.exports=router;