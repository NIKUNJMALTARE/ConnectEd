const getBestMentorMatch = (mentee, mentors) => {
    let bestMatch = null;
    let maxScore = 0;

    mentors.forEach((mentor) => {
        let score = 0;

        // Score based on matching interests
        mentor.expertise.forEach((skill) => {
            if (mentee.interests.includes(skill)) {
                score += 2; // More weight to expertise match
            }
        });

        // Check mentor availability
        if (mentor.availability === "Flexible") {
            score += 1;
        }

        if (score > maxScore) {
            maxScore = score;
            bestMatch = mentor;
        }
    });

    return bestMatch;
};

module.exports = { getBestMentorMatch };
