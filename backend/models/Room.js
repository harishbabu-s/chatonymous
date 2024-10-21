// models/Room.js
const mongoose = require('mongoose');
const { title } = require('process');

const roomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
        unique: true,
        minLength: [4, 'Room name must be at least 4 characters long'],
        maxLength: [16, 'Room name can have at most 16 characters'],
    },
    passkey: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        min: 2,
        max: 120,
        required: true
    }, // in minutes
    title: {
        type: String,
        maxLength: [50, 'Title can have at most 32 characters'],
        default: 'Untitled topic being discussed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Room', roomSchema);
