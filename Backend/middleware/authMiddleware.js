const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Extract the token
            token = req.headers.authorization.split(" ")[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                console.error("❌ User not found in database");
                return res.status(401).json({ message: "User not found" });
            }

            console.log("✅ Authenticated User:", req.user._id);
            next();
        } catch (error) {
            console.error("❌ Token verification failed:", error.message);
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    } else {
        console.error("❌ No token provided");
        return res.status(401).json({ message: "No token provided, authorization denied" });
    }
};

module.exports = protect;
