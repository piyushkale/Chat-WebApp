const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/msgController");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);
router.post("/send", sendMessage);

module.exports = router;
