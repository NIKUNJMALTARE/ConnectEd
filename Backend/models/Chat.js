const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    room: { type: String, required: true },
    messages: [
        {
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            message: { type: String, required: true },
            time: { type: Date, default: Date.now },
        }
    ]
});

module.exports = mongoose.model("Chat", chatSchema);
