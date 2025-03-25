const express = require("express");
const { findMentor } = require("../controllers/matchController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Protected route to find a mentor
router.get("/", protect, findMentor);

module.exports = router;
