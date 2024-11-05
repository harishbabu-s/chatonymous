require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { type } = require("os");

const PORT = process.env.PORT || 4000;

// Middleware
const app = express();
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://chatonymous-6lzq.onrender.com'
        : 'http://localhost:3000'
}));
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? 'https://chatonymous-6lzq.onrender.com'
            : 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
});

const rooms = {};
const messages = {};

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

const uUserID = (room) => {
    const uniqueCodes = ["FF0000", "00FF00", "0000FF", "FFFF00", "FF00FF", "00FFFF", "000000", "800000", "800080", "808080", "C0C0C0", "400000", "000040", "404000", "004040", "404040", "002000", "000020", "006000", "006060",];

    randomDefinedCode = () => {
        let temp = uniqueCodes[Math.floor(Math.random() * uniqueCodes.length)];
        if (Object.values(room.users).includes(temp)) {
            randomDefinedCode();
        } else {
            return temp;
        }
    }

    if (Object.keys(room.users).length < uniqueCodes.length) {
        return randomDefinedCode();
    } else {
        getRandomColor();
    }
};


// Routes
app.get('/', (req, res) => {
    res.send("Server is running");
})

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
        users: {},
        inRoomUsers: []
    };

    messages[roomName] = [{}];


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

app.get('/rooms/all-messages', (req, res) => {
    res.json(messages);
});

app.get('/rooms/messages/:roomName', (req, res) => {
    const { roomName } = req.params;
    const roomMessages = messages[roomName];
    res.json(roomMessages);
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
    // console.log('New user connected -', socket.id);

    socket.on('join_room', ({ roomName, password }) => {
        if (!rooms[roomName]) {
            return socket.emit('roomError', 'Room not found OR Room has expired');
        }
        const room = rooms[roomName];
        const previousMessages = messages[roomName]

        if (room && room.password === password) {

            if (Date.now() <= room.expiryTime) {
                const user_uid = uUserID(room);
                room.users[socket.id] = user_uid;
                room.inRoomUsers.push(user_uid);

                socket.join(roomName);
                socket.emit('roomJoined', { title: room.title, expiresAt: room.expiryTime, duration: room.duration, user_uid });
                io.to(roomName).emit('usersUpdate', { inRoomUsers: room.inRoomUsers });

                previousMessages.forEach(({ message, uid, type }) => {
                    socket.emit('receiveMessage', { message, uid, type });
                });

                messages[roomName].push({ message: 'joined', uid: user_uid, type: 'info' });
                io.to(roomName).emit('receiveMessage', { message: 'joined', uid: user_uid, type: 'info' });
            } else {
                socket.emit('roomError', 'Room has expired');
            }
        } else {
            socket.emit('roomError', 'Inavalid room name or password');
        }
    });

    socket.on('sendMessage', ({ roomName, message, type }) => {
        if (rooms[roomName]) {
            const room = rooms[roomName];
            if (Date.now() <= room.expiryTime) {
                const uid = room.users[socket.id];
                messages[roomName].push({ message, uid, type });
                io.to(roomName).emit('receiveMessage', { message, uid, type });

            } else {
                socket.emit('roomError', 'Room has expired');
            }
        } else {
            socket.emit('roomError', 'Room has expired');
        }
    });


    socket.on('leaveRoom', ({ roomName, userId }) => {
        if (rooms[roomName]) {
            leaveRoom(roomName, userId);
        }
    });

    socket.on('disconnect', () => {
        for (const roomName in rooms) {
            if (rooms[roomName].users[socket.id]) {
                const userId = rooms[roomName].users[socket.id];
                leaveRoom(roomName, userId);
                break;
            }
        }
    });

    const leaveRoom = (roomName, userId) => {
        rooms[roomName].inRoomUsers = rooms[roomName].inRoomUsers.filter(id => id !== userId);
        socket.to(roomName).emit('userLeft', rooms[roomName].inRoomUsers);
        messages[roomName].push({ message: 'left', uid: userId, type: 'info' });
        io.to(roomName).emit('receiveMessage', { message: 'left', uid: userId, type: 'info' });
        io.to(roomName).emit('usersUpdate', { inRoomUsers: rooms[roomName].inRoomUsers });
        if (rooms[roomName].inRoomUsers.length === 0) {
            delete rooms[roomName];
        }
    }

});


setInterval(() => {
    const now = Date.now();
    for (const room in rooms) {
        if (rooms[room].expiryTime < now) {
            delete rooms[room];
        }
    }
}, 60000);

server.listen(PORT, () => {
    console.log("Server is running", process.env.NODE_ENV === 'production' ? " : https://chatonymous-6lzq.onrender.com" : " : http://localhost: ", PORT ? PORT : 4000);
});
