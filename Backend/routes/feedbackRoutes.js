const express = require("express");
const { submitFeedback, getMentorFeedback } = require("../controllers/feedbackController");

const router = express.Router();

router.post("/", submitFeedback);
router.get("/:mentorId", getMentorFeedback);

module.exports = router;
