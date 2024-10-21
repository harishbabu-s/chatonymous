// controllers/roomController.js
const Room = require('../models/Room');
const { getRandomColor, generateAlphanumericPasskey } = require('../utils.js/helpers');


// Create a new room
exports.createRoom = async (req, res) => {
    const passkey = generateAlphanumericPasskey();

    const { roomName, duration, title, } = req.body;

    try {
        const room = new Room({ roomName, passkey, duration, title });
        await room.save();
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: 'Error creating room from server', error });
    }
};

// Join an existing room
exports.joinRoom = async (req, res) => {
    const color = getRandomColor();


    const roomName = req.params.room;
    try {
        const room = await Room.findOne({ roomName });
        if (room) {
            res.status(200).json(room);
        } else {
            res.status(404).json({ message: 'Invalid Room Name or Passkey' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error joining room', error });
    }
};

exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({});
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
