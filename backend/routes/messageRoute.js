const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessage,
  getAllMessages,
  getPersonalMessages,
  sendMedia,
} = require("../controllers/msgController");
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.use(authMiddleware);

router.get("/getMessage", getMessage);
router.get("/allMessages", getAllMessages);
router.post("/send", sendMessage);
router.get("/personalMessages", getPersonalMessages);

router.post("/sendMedia", upload.single("media"), sendMedia);

module.exports = router;
