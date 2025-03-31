const Feedback = require("../models/Feedback");

// Submit Feedback
const submitFeedback = async (req, res) => {
    const { mentorId, menteeId, rating, comment } = req.body;

    try {
        const feedback = new Feedback({ mentorId, menteeId, rating, comment });
        await feedback.save();
        res.status(201).json({ message: "Feedback submitted successfully", feedback });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get Mentor Feedback
const getMentorFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({ mentorId: req.params.mentorId });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { submitFeedback, getMentorFeedback };
