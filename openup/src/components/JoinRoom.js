import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const JoinRoom = () => {
    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const joinRoom = async (e) => {
        e.preventDefault();
        await axios.post(`${config.apiUrl}/join-room/`, { roomName, password })
            .then((res) => {
                if (res.data.roomName && res.data.password) {
                    navigate(`/chat-room/${res.data.roomName}/${res.data.password}`);
                }
            })
            .catch((err) => {
                alert("Invalid Room Name or password");
                console.log("Error fetching : ", err)
            });
    };

    return (
        <div className="container my-2 p-0">
            <input type="text" placeholder="Room Name" className="form-control" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            <input type="number" placeholder="6 digit password" className="form-control mt-2" value={password} onKeyDown={(e) => e.key === 'Enter' && joinRoom(e)} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn btn-primary mt-3" onClick={joinRoom} disabled={!roomName || !password} >Join</button>
        </div>
    );
};

export default JoinRoom;
