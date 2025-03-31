const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
    {
        mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        mentee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        status: { type: String, enum: ["pending", "confirmed", "canceled"], default: "pending" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
