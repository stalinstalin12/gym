const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/users',userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/user/:id', userController.getSingleUser);
router.delete('/user/:id', userController.deleteUser);
router.get('/userprofile', userController.viewUserProfile);
router.put('/updateUser',userController.updateUser)


module.exports = router;