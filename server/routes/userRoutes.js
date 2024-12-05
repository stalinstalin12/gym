const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/users',userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/user/:id', userController.getSingleUser);
router.delete('/user/:id', userController.deleteUser);



module.exports = router;