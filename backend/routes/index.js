const express = require("express");
const router = express.Router();
const userRoute = require("./userRoute");
const msgRoute = require("./messageRoute");

router.use("/user", userRoute);
router.use("/message", msgRoute);

module.exports = router;
