const User = require("../models/User");
const { getBestMentorMatch } = require("../utils/matchingAlgorithm");

const findMentor = async (req, res) => {
    try {
        const mentee = await User.findById(req.user._id);
        if (!mentee || mentee.role !== "mentee") {
            return res.status(400).json({ message: "Only mentees can find mentors" });
        }

        // Fetch available mentors
        const mentors = await User.find({ role: "mentor" });

        // Use AI Matching Algorithm
        const bestMatch = getBestMentorMatch(mentee, mentors);

        if (!bestMatch) {
            return res.status(404).json({ message: "No suitable mentor found" });
        }

        res.json({
            mentor: {
                _id: bestMatch._id,
                name: bestMatch.name,
                email: bestMatch.email,
                expertise: bestMatch.expertise,
                availability: bestMatch.availability,
            },
        });
    } catch (error) {
        console.error("Error finding mentor:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { findMentor };
