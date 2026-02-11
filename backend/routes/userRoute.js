const express = require("express");
const {signupUser,loginUser} = require('../controllers/userController')
const router = express.Router();

router.post('/signup',signupUser) //creating new account

router.post('/login',loginUser)  // user Login 

module.exports = router