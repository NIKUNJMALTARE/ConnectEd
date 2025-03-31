const express = require("express");
const { getChatHistory } = require("../controllers/chatController");
const router = express.Router();

router.get("/:room", getChatHistory);

module.exports = router;
