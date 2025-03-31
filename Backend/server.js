const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require("http");
const { Server } = require("socket.io");

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require("./routes/matchRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const { saveMessage } = require("./controllers/chatController");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Connect to MongoDB
connectDB();

// For Frontend Connectivity
const corsOptions = {
  origin: 'http://localhost:3000', // specify your frontend's URL
  credentials: true,
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Welcome to your express application'
  });   
});

// 🔹 WebSocket for Chat and Video Call
const users = {};

io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);

    // **🔹 Handle Joining Rooms**
    socket.on("joinRoom", ({ room, userId }) => {
        socket.join(room);
        users[userId] = socket.id;
        console.log(`User ${userId} joined room ${room}`);
    });

    // **🔹 Handle Sending Messages**
    socket.on("sendMessage", async ({ room, message, senderId }) => {
        io.to(room).emit("receiveMessage", { message, senderId, time: new Date() });
        await saveMessage(room, senderId, message);
    });

    // **🔹 WebRTC Signaling for Video Call**
    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        io.to(users[userToCall]).emit("callIncoming", { signal: signalData, from, name });
    });

    socket.on("answerCall", ({ to, signal }) => {
        io.to(users[to]).emit("callAccepted", signal);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected: " + socket.id);
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});