const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const PORT = process.env.PORT;


// Middleware
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
});

const rooms = {};


// Helper functions
const generatePassword = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};


// Routes
app.post('/create-room', (req, res) => {
    const { roomName, duration, title } = req.body;
    const roomPassword = generatePassword();
    const expiresAt = Date.now() + duration * 60 * 1000;

    if (rooms[roomName]) {
        return res.status(400).json({ error: 'Room name already exists' });
    }

    rooms[roomName] = {
        password: roomPassword,
        title,
        duration,
        expiryTime: expiresAt,
        users: {}
    };
    res.json({ roomName, roomPassword, title, duration, expiresAt });
});

app.post('/join-room', (req, res) => {
    const { roomName, password } = req.body;
    const room = rooms[roomName];

    if (!room || room.password !== password) {
        return res.status(400).json({ error: 'Invalid room name or password' });
    }

    if (Date.now() > room.expiryTime) {
        return res.status(400).json({ error: 'Room has expired' });
    }

    res.json({ roomName, password, title: room.title, duration: room.duration, expiryTime: room.expiryTime });

});

app.get('/rooms', (req, res) => {
    res.json(rooms);
});

app.get('/rooms/:roomName', (req, res) => {
    const { roomName } = req.params;
    const room = rooms[roomName];
    res.json(room);
});


// Socket.io
io.on('connect', (socket) => {
    console.log('New user connected -', socket.id);

    socket.on('join_room', ({ roomName, password }) => {
        const room = rooms[roomName];

        if (room && room.password === password) {

            if (Date.now() <= room.expiryTime) {
                socket.join(roomName);
                const user_uid = getRandomColor();
                if (!rooms[roomName].users[socket.id]) {
                    rooms[roomName].users[socket.id] = user_uid;
                }
                socket.emit('roomJoined', { title: room.title, expiresAt: room.expiryTime, duration: room.duration, user_uid });
                // rooms[roomName].users[socket.id] = `User${socket.id.slice(-4)}`;
                // socket.to(roomName).emit('userJoined', rooms[roomName].users[socket.id]);            
                // socket.to(roomName).emit('userJoined',);

                // // Send previous messages
                // room.messages.forEach(message => {
                //     socket.emit('message', message);
                // });
            } else {
                io.in(room).socketsLeave(room);
                socket.emit('roomExpired');
            }
        } else {
            socket.emit('error', 'Inavalid room name or password');
        }

    });

    socket.on('sendMessage', ({ roomName, message }) => {
        if (rooms[roomName]) {
            const room = rooms[roomName];
            if (Date.now() <= room.expiryTime) {
                const uid = rooms[roomName].users[socket.id];
                io.to(roomName).emit('receiveMessage', { message, uid });
            } else {
                io.in(room).socketsLeave(room);
                socket.emit('roomExpired');
            }
        } else {
            socket.emit('roomError', 'Inavalid room name or password');
        }
    });

    socket.on('disconnect', () => {
        if (rooms[roomName]) {
            socket.to(currentRoom).emit('userLeft', username);
        }
    });



});

// setInterval(() => {
//     const now = Date.now();
//     for (const room in rooms) {
//         if (rooms[room].expiryTime < now) {
//             io.to(room).emit('roomExpired');
//             io.in(room).socketsLeave(room);
//             delete rooms[room];
//         }
//     }
// }, 60000);


server.listen(PORT || 4000, () => {
    console.log("Server is running on http://localhost: ", PORT ? PORT : 4000);
});
