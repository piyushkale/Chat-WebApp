const express = require("express");
const router = express.Router();
const { sendMessage, getMessage, getAllMessages } = require("../controllers/msgController");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

router.get("/getMessage", getMessage);
router.get("/allMessages",getAllMessages)
router.post("/send", sendMessage);


module.exports = router;
