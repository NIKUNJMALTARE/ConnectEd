const User = require('../models/User');
const jwt = require("jsonwebtoken");

// Function to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};


// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        console.log("🔍 Request received to update profile", req.user._id); // Log user ID
        
        const user = await User.findById(req.user._id);
        if (!user) {
            console.log("❌ User not found");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ User found, updating profile...");

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.expertise = req.body.expertise || user.expertise;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();
        console.log("✅ Profile updated successfully");

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            expertise: updatedUser.expertise,
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        console.error("❌ Error updating profile:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


module.exports = { getUserProfile, updateUserProfile };
