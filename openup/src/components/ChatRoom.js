import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Nav from './Nav';

let socket;

const ChatRoom = () => {
    const { roomName, roomPassword } = useParams();
    const [title, setTitle] = useState('Untitled topic being discussed');
    const [expiresAt, setExpiresAt] = useState();
    const [uid, setUid] = useState(0);
    const [timer, setTimer] = useState(0);
    const [duration, setDuration] = useState(0);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const messageEndRef = useRef(null);

    useEffect(() => {
        socket = io(`http://localhost:4000`);
        socket.emit('join_room', { roomName, password: roomPassword });

        socket.on('roomJoined', ({ title, expiresAt, duration, user_uid }) => {
            console.log("Room joined")
            if (title !== '') {
                setTitle(title);
            }
            setExpiresAt(expiresAt);
            setUid(user_uid);
            setDuration(duration);
        });

        socket.on('receiveMessage', ({ message, uid }) => {
            setMessages((prev) => [...prev, { message: message, varUid: uid }]);
        });

        socket.on('roomExpired', () => {
            alert('Room expired');
            socket.disconnect();
        });

        socket.on('roomError', () => {
            alert('Invalid Room Name or Password');
            socket.disconnect();
        });

        return () => {
            socket.disconnect(roomName);
        };
    }, [roomName, roomPassword]);

    const sendMessage = () => {
        if (message) {
            socket.emit('sendMessage', { roomName, message });
            setMessage('');
        }
    };

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && event.shiftKey) {
            event.preventDefault();
            setMessage((prev) => prev + '\n');
        } else if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };


    const handleTimer = () => {
        const countdown = Math.round((expiresAt - Date.now()) / 1000);
        setTimer(countdown);
        const timerInterval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 0) {
                    clearInterval(timerInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        if (expiresAt > 0) {
            handleTimer();
        }
    }, [expiresAt]);



    return (
        <div className='d-flex flex-column min-vh-100'>
            <Nav />
            <div className='container ' >
                <div className='d-flex'>
                    <span style={{ fontSize: '1.5rem' }}>{title}</span>
                    <div className=' align-content-center ms-auto'><span> [ Time remaining: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')} / {duration} mins ]</span></div>
                </div>

                <div className="d-flex flex-column flex-fill overflow-auto pt-2 border" style={{ minHeight: '70vh', maxHeight: '70vh', scrollbarWidth: 'thin', scrollMarginBottom: '10px' }} >
                    {messages.map((msgData, index) => {
                        const isUserMessage = msgData.varUid === uid;
                        const messageContainer = `p-0 mx-1 text-${isUserMessage ? 'end' : 'start'}`
                        const messageClass = `d-inline-block my-1 px-2 fs-5 rounded-${isUserMessage ? 'start-4' : 'end-4'} border-4`;

                        return (
                            <div className={messageContainer}>
                                <div key={index} className={messageClass} style={{ border: `solid #${msgData.varUid}`, whiteSpace: 'pre-wrap' }} >
                                    {msgData.message}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messageEndRef} />
                </div>
                <div className="input-group ">
                    <textarea type="text" className="form-control" value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type message..."
                        style={{ height: '1rem', maxHeight: '3rem' }}
                    />
                    <button className="btn btn-outline-secondary" type="button" onClick={sendMessage} id="button-addon2">Send</button>
                </div>

            </div >
        </div>
    );
};

export default ChatRoom;
