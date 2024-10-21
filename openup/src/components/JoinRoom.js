// src/components/JoinRoom.js
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../utils/RoomContext';

const JoinRoom = () => {
    const { roomName, changeRoomName } = useRoom();
    const [roomNameValue, setRoomNameValue] = useState('');
    const [passkeyValue, setPasskeyValue] = useState('');
    const navigate = useNavigate();

    const joinRoom = (e) => {
        e.preventDefault();
        changeRoomName(roomNameValue);
        axios.get(`http://localhost:4000/api/rooms/join/${roomNameValue}`)
            .then((res) => {
                navigate(`/chat-room/${res.data.roomName}/${res.data.passkey}`);
            })
            .catch((err) => {
                console.log("Error fetching : ", err)
            });
    };

    return (
        <div className="m-4">
            <input type="text" placeholder="Room Name" className="form-control" value={roomNameValue} onChange={(e) => setRoomNameValue(e.target.value)} />
            <input type="text" placeholder="Passkey" className="form-control mt-2" value={passkeyValue} onChange={(e) => setPasskeyValue(e.target.value)} />
            <button className="btn btn-primary mt-3" onClick={joinRoom}>Join</button>
        </div>
    );
};

export default JoinRoom;
