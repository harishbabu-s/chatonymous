// routes/roomRoutes.js
const express = require('express');
const Room = require('../models/Room');
const { createRoom, joinRoom, getRooms } = require('../controllers/roomController');
const router = express.Router();

// Route for creating a room
router.post('/create', createRoom);

// Route for joining a room
router.get('/join/:room', joinRoom);

router.get('/all', getRooms);

module.exports = router;
