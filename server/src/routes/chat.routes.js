const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const { sendMessage } = require("../controllers/chat.controller");

const router = express.Router();

router.post("/send", authMiddleware, sendMessage);

module.exports = router;