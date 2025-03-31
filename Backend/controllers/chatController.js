const Chat = require("../models/Chat");

// Fetch Chat History
const getChatHistory = async (req, res) => {
    try {
        const chat = await Chat.findOne({ room: req.params.room });
        if (!chat) return res.status(404).json({ message: "No chat found" });
        res.json(chat.messages);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Store Messages in DB
const saveMessage = async (room, senderId, message) => {
    try {
        let chat = await Chat.findOne({ room });
        if (!chat) {
            chat = new Chat({ room, messages: [] });
        }
        chat.messages.push({ senderId, message });
        await chat.save();
    } catch (error) {
        console.error("Error saving message:", error);
    }
};

module.exports = { getChatHistory, saveMessage };
