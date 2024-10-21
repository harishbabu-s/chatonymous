// index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const cors = require("cors");
require('dotenv').config();

const roomRoutes = require('./routes/roomRoutes');
const Room = require('./models/Room');


// Middleware
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http:localhost:4000',
        methods: ["GET", "POST"]
    }
});

// Connect to MongoDB
connectDB();


// Use routes
app.use('/api/rooms', roomRoutes);

// Socket.io functionality
io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('joinRoom', async ({ roomName, passkey }) => {
        try {
            let room = await Room.findOne({ roomName, passkey })
            if (room) {
                socket.join(roomName);
                socket.to(roomName).emit('message', `${socket.id} has joined the room`)
                socket.emit('roomJoined', room);
            } else {
                socket.emit('error', 'Invalid Room Name or Passkey');
            }
        } catch (error) {
            socket.emit('error', 'An error occurred while trying to join the room');
            console.log('Error joining room', error);
        }
    });

    socket.on('sendMessage', ({ roomName, message }) => {
        io.to(roomName).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Room expiration logic
setInterval(async () => {
    try {
        const rooms = await Room.find({});

        for (const room of rooms) {
            const expirationTime = new Date(room.createdAt.getTime() + room.duration * 60000);
            if (new Date() > expirationTime) {
                await Room.deleteOne({ _id: room._id });
                io.to(room.roomName).emit('roomExpired');
                io.in(room.roomName).socketsLeave(room.roomName);
            }
        }
    } catch (err) {
        console.error('Error fetching or deleting rooms:', err);
    }
}, 60000); // Check every minute


// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
