import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Nav from './Nav';
import config from '../config';

let socket;

const ChatRoom = () => {
    const { roomName, roomPassword } = useParams();
    const [title, setTitle] = useState('Untitled topic being discussed');
    const [expiresAt, setExpiresAt] = useState();
    const [uid, setUid] = useState(0);
    const [timer, setTimer] = useState(0);
    const [duration, setDuration] = useState(0);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const messageEndRef = useRef(null);

    useEffect(() => {
        socket = io(`${config.socketUrl}`);
        socket.emit('join_room', { roomName, password: roomPassword });

        socket.on('roomJoined', ({ title, expiresAt, duration, user_uid, inRoomUsers }) => {
            if (title !== '') {
                setTitle(title);
            }
            setExpiresAt(expiresAt);
            setDuration(duration);
            setUid(user_uid);
        });

        socket.on('usersUpdate', ({ inRoomUsers }) => {
            setUsers(inRoomUsers);
        });

        socket.on('receiveMessage', ({ message, uid, type }) => {
            setMessages((prev) => [...prev, { message: message, varUid: uid, type: type }]);
        });

        socket.on('roomError', (error) => {
            alert(error);
        });

        return () => {
            socket.emit('leaveRoom', { roomName, uid });
            socket.disconnect();
        };
    }, [roomName, roomPassword]);

    const sendMessage = () => {
        if (message) {
            socket.emit('sendMessage', { roomName, message, type: 'message' });
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
                    <span style={{ fontSize: '1.5rem' }}><u>{title}</u></span>
                    <div className=' align-content-center ms-auto'><span> [ Time left: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')} / {duration} mins ]</span></div>
                </div>
                <div className="d-flex flex-wrap fs-5">
                    <span className='fs-5'>In room :</span>
                    {users.map((user, index) => (
                        <span key={index} className="badge mx-1 px-3 fs-6" style={{ backgroundColor: `#${user}` }}> </span>
                    ))}
                </div>

                <div className="d-flex flex-column flex-fill overflow-auto pt-2 border" style={{ minHeight: '65vh', maxHeight: '70vh', scrollbarWidth: 'thin', scrollMarginBottom: '10px' }} >
                    {messages.map((msgData, index) => {
                        const isUserMessage = msgData.varUid === uid;
                        const messageContainer = `p-0 mx-1 text-${isUserMessage && msgData.type === 'message' ? 'end' : msgData.type === 'info' ? 'center' : 'start'}`;
                        const messageClass = `d-inline-block my-1 px-2 rounded-${isUserMessage && msgData.type === 'message' ? 'start-4 fs-5' : msgData.type === 'info' ? '4 fs-6' : 'end-4 fs-5'} border-4`;

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
