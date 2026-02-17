const express = require("express");
const { signupUser, loginUser ,allUsers} = require("../controllers/userController");
const router = express.Router();
const authenticate = require('../middlewares/auth')

router.post("/signup", signupUser); //creating new account

router.post("/login", loginUser); // user Login

router.get("/allUsers", authenticate,allUsers);

module.exports = router;
