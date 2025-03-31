const User = require("../models/User");
const Appointment = require("../models/Appointment");
const nodemailer = require("nodemailer");

// Modify bookAppointment to send email
const bookAppointment = async (req, res) => {
    try {
        const { mentorId, date, time } = req.body;
        const mentee = await User.findById(req.user._id);
        const mentor = await User.findById(mentorId);

        if (!mentee || mentee.role !== "mentee") {
            return res.status(400).json({ message: "Only mentees can book appointments." });
        }

        if (!mentor || mentor.role !== "mentor") {
            return res.status(400).json({ message: "Invalid mentor." });
        }

        const appointment = new Appointment({
            mentor: mentorId,
            mentee: req.user._id,
            date,
            time,
            status: "pending",
        });

        await appointment.save();

        // Send email to mentee
        await sendEmail(
            mentee.email,
            "Appointment Confirmation",
            `Your session with ${mentor.name} on ${date} at ${time} is confirmed.`
        );

        // Send email to mentor
        await sendEmail(
            mentor.email,
            "New Mentoring Appointment",
            `${mentee.name} has booked a session with you on ${date} at ${time}.`
        );

        res.status(201).json({ message: "Appointment booked successfully!", appointment });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { bookAppointment };
