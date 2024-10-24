import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JoinRoom = () => {
    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const joinRoom = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:4000/join-room/', { roomName, password })
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
        <div className="m-4">
            <input type="text" placeholder="Room Name" className="form-control" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            <input type="text" placeholder="Passkey" className="form-control mt-2" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn btn-primary mt-3" onClick={joinRoom}>Join</button>
        </div>
    );
};

export default JoinRoom;
