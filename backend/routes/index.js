const express = require("express");
const router = express.Router();
const userRoute = require("./userRoute");
const msgRoute = require("./messageRoute");
const aiRoute = require("./aiRoute");

router.use("/user", userRoute);
router.use("/message", msgRoute);
router.use("/ai", aiRoute);
module.exports = router;
