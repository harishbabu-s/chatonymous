import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

let socket;

const ChatRoom = () => {
    const { roomName, roomPassword } = useParams();
    const [title, setTitle] = useState('Untitled topic being discussed');
    const [expiresAt, setExpiresAt] = useState(0);
    const [uid, setUid] = useState(0);
    const [tempUid, setTempUid] = useState(0);
    const [timer, setTimer] = useState(0);
    const [duration, setDuration] = useState(0);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);


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
            console.log("message received")
            setMessages((prev) => [...prev, message]);
            setTempUid(uid);
        });

        socket.on('roomExpired', () => {
            alert('Room expired');
            socket.disconnect();
        });

        socket.on('rooError', () => {
            alert('Invalid Room Name or Password');
            socket.disconnect();
        });

        return () => {
            socket.disconnect();
        };
    }, [roomName, roomPassword]);

    const sendMessage = () => {
        if (message) {
            console.log("message sent");
            socket.emit('sendMessage', { roomName, message });
            setMessage('');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const handleTimer = () => {
        const tempDuration = 0;
        while (expiresAt) {
            tempDuration = (expiresAt - Date.now()) / 1000;
            break;
        }
        const countdown = tempDuration * 60;
        console.log(Date.now(), "------", expiresAt, "===============", tempDuration, "+++++++++", countdown);
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
        handleTimer();
    }, []);


    // const scrollToBottom = () => {
    //     if (messagesEndRef.current) {
    //         messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    //     }
    // };

    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages]); // Scroll to bottom whenever messages change


    return (
        <div className='container ' >
            {/* <h5>{details.title}</h5> */}
            <h2>{title}</h2>
            <h4>Room: {roomName}, Password: {roomPassword} </h4>
            <div>Time remaining: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')} / {duration}:00 </div>
            {/* <p>Passkey: {details.passkey}</p> */}
            {/* <div className="chat-container overflow-auto border " style={{ height: '50vh' }}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${tempUid === uid ? 'sent' : 'received'}`}
                        style={MessageStyle(tempUid === uid ? 'sent' : 'received')}
                    >
                        <div className="message-content border rounded-pill">
                            <span>{msg}</span>
                        </div>
                    </div>
                ))}
            </div> */}

            <div className="d-flex flex-column-reverse overflow-auto border" style={{ height: '50vh' }}>
                {messages.map((msg, index) => {
                    const isUserMessage = tempUid === uid; // Check if the message is from the current user
                    const messageClass = `d-inline-block text-${isUserMessage ? 'end' : 'start'} 
                    border border-${tempUid} rounded-${isUserMessage ? 'start' : 'end'}-pill 
                    rounded-${isUserMessage ? 'right' : 'left'}`;

                    return (
                        // <div key={msg.id} className={messageClass} style={{ backgroundColor: `#${msg.userId}` }}>
                        <div key={index} className={messageClass} >
                            {msg}
                        </div>
                    );
                })}
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
        </div >
    );
};

export default ChatRoom;
