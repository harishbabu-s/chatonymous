import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateRoom = () => {
    const [roomName, changeRoomName] = useState('');
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState();
    const navigate = useNavigate();

    const createRoom = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:4000/create-room', { roomName, duration, title })
            .then(response => {
                navigate(`/chat-room/${roomName}/${response.data.roomPassword}`);
            })
            .catch(error => {
                alert(error)
            });
    };

    return (
        <div className="mx-5 my-2 text-start ">
            <form>
                <label htmlFor="roomTitle" className='h6 my-0 ms-2'>Title</label>
                <input type="text" id="roomTitle" placeholder="Optional topic tile" className="form-control mb-2" value={title} onChange={(e) => setTitle(e.target.value)} />
                <label htmlFor="roomName" className='h6 my-0 ms-2'>Room Name</label>
                <input type="text" id="roomName" placeholder="Room Name" className="form-control mb-2" value={roomName} onChange={(e) => changeRoomName(e.target.value)} />
                <label htmlFor="duration" className='h6 my-0 ms-2'>Duration (mins)</label>
                <input type="number" id='duration' placeholder="2 mins - 120 mins(2 hrs)" className="form-control mb-2" value={duration} onChange={(e) => setDuration(e.target.value)} min={2} max={120} />
                <button type="submit" className="btn btn-success mt-3" onClick={createRoom}>Create Room</button>
            </form>
        </div>
    );
};

export default CreateRoom;
