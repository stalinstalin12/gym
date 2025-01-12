const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const{set}=require('mongoose');
const accessControl=require('../utils/access-control').accessControl;

function setaccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}

router.post('/users',userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/user/:id', userController.getSingleUser);
router.delete('/user/:id', userController.deleteUser);
router.get('/userprofile', userController.viewUserProfile);
router.put('/updateUser',userController.updateUser)
router.post('/requestUpgrade',setaccessControl('2'), userController.requestUpgrade);
router.put('/approveUpgrade/:id',setaccessControl('1'), userController.approveUpgrade);
router.delete('/rejectUpgrade/:id', setaccessControl('1'), userController.rejectUpgrade);
router.get('/upgradeRequests',setaccessControl('1'),  userController.getAllUpgradeRequests);
// Block a user
router.patch('/block/:id',setaccessControl('1'), userController.blockUser);

// Unblock a user
router.patch('/unblock/:id',setaccessControl('1'), userController.unblockUser);
module.exports = router;