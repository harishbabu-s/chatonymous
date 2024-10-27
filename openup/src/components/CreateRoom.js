import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const CreateRoom = () => {
    const [roomName, changeRoomName] = useState('');
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState();
    const navigate = useNavigate();

    const createRoom = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${config.apiUrl}/create-room`, { roomName, duration, title })
                .then(response => {
                    navigate(`/chat-room/${roomName}/${response.data.roomPassword}`);
                })
                .catch(error => {
                    if (error.response.status === 400) alert('Room name already taken');
                    else alert(error);
                });
        } catch (error) {
            alert("Error connecting to server. Please try again later.");
        }
    };

    const durationCondition = duration > 120 || duration < 2;
    const roomNameCondition = roomName.length < 4 && roomName.length > 0;

    return (
        <div className=" my-2 text-start ">
            <form>
                <label htmlFor="roomTitle" className='h6 m-0'>Title</label>
                <input type="text" id="roomTitle" className="form-control mb-2" placeholder="Optional topic tile" value={title} onChange={(e) => setTitle(e.target.value)} />

                <label htmlFor="roomName" className='h6 m-0'>Room Name {roomNameCondition ? <span className='text-danger'>* min 4 characters</span> : ''} </label>
                <input type="text" id="roomName" className="form-control mb-2" placeholder="Room Name" value={roomName} onChange={(e) => changeRoomName(e.target.value)} />

                <label htmlFor="duration" className='h6 m-0'>Duration (mins)</label>
                <input type="number" id='duration' className={`form-control mb-2  ${durationCondition && duration > 0 ? 'is-invalid' : ''}`} placeholder="2 mins - 120 mins(2 hrs)" value={duration} onChange={(e) => setDuration(e.target.value)} min={2} max={120} required />

                <button type="submit" className='btn btn-success mt-3' disabled={durationCondition || roomName.length < 4} onClick={createRoom}>Create Room</button>
            </form>
        </div>
    );
};

export default CreateRoom;
