const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const { sendMessage, getChatHistory } = require("../controllers/chat.controller");

const router = express.Router();

router.post("/send", authMiddleware, sendMessage);
router.get("/history", authMiddleware, getChatHistory);

module.exports = router;