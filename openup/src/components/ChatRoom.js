// src/components/ChatRoom.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useRoom } from '../utils/RoomContext';

const socket = io(`http://localhost:4000`);

const ChatRoom = () => {
    const { roomName, setRoomName } = useRoom();
    const [details, setDetails] = useState({
        roomName: '',
        title: '',
        passkey: '',
        duration: ''

    });
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);


    useEffect(() => {
        axios.get(`http://localhost:4000/api/rooms/join/${roomName}`)
            .then(response => {
                setDetails(response.data)
            })
            .catch(err => {
                console.log('Error in chat room', err)
            });
    }, [])

    const passkey = details.passkey;
    useEffect(() => {

        socket.emit('joinRoom', { roomName, passkey });

        socket.on('message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socket.on('roomExpired', () => {
            alert('This room has expired.');
        });

        return () => {
            socket.disconnect();
        };
    }, [roomName]);

    const sendMessage = () => {
        if (message) {
            socket.emit('sendMessage', { roomName, message });
            setMessage('');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className='container ' >
            <h5>{details.title}</h5>
            <h2>Room: {roomName}</h2>
            <p>Passkey: {details.passkey}</p>
            <div className="chat-container border border-dark" style={{ height: '50vh' }}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        // className={`message ${msg.senderId === currentUserId ? 'sent' : 'received'}`}
                        className='message received'
                    >
                        <div className="message-content border rounded-pill">
                            <span>{msg}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="input-group mb-2">
                <input type="text" className="form-control" value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type message..."
                    aria-label="Send message"
                    aria-describedby="button-addon2" />
                <button className="btn btn-outline-secondary" type="button" onClick={sendMessage} id="button-addon2">Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;
