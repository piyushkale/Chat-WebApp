const express = require("express");
const router = express.Router();
const { sendMessage, getAllMessages } = require("../controllers/msgController");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

router.get("/allMessages", getAllMessages);
router.post("/send", sendMessage);

module.exports = router;
