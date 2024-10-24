import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Nav from './Nav';

let socket;

const ChatRoom = () => {
    const { roomName, roomPassword } = useParams();
    const [title, setTitle] = useState('Untitled topic being discussed');
    const [expiresAt, setExpiresAt] = useState();
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
            handleTimer();
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

    // let tempDuration = 0;
    // while (expiresAt) {
    //     console.log("--------------", expiresAt, Date.now(), "===================");
    //     tempDuration = (expiresAt - Date.now()) / 1000;
    //     console.log("--------------", expiresAt, ".................", Date.now(), "===================");
    //     break;
    // }

    const handleTimer = () => {
        let tempDuration = 0;
        tempDuration = (expiresAt - Date.now()) / 1000;
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

    // useEffect(() => {
    //     handleTimer();
    // }, []);


    // const scrollToBottom = () => {
    //     if (messagesEndRef.current) {
    //         messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    //     }
    // };

    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages]); // Scroll to bottom whenever messages change


    return (
        <div className='d-flex flex-column min-vh-100'>
            <Nav />
            <div className='container ' >
                {/* <h5>{details.title}</h5> */}
                <div className='d-flex'>
                    <span style={{ fontSize: '1.5rem' }}>{title}</span>
                    <div className=' align-content-center ms-auto'><span> [Time remaining: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')} / {duration} mins ]</span></div>
                </div>
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

                <div className="flex-fill flex-column-reverse overflow-auto border" style={{ minHeight: '80vh' }} >
                    {messages.map((msg, index) => {
                        const isUserMessage = tempUid === uid; // Check if the message is from the current user
                        const messageClass = `d-inline-block text-${isUserMessage ? 'end' : 'start'} 
                    border border-${tempUid} rounded-${isUserMessage ? 'start' : 'end'}-pill 
                    rounded-${isUserMessage ? 'right' : 'left'}`;

                        return (
                            // <div key={msg.id} className={messageClass} style={{ backgroundColor: `#${msg.userId}` }}>
                            <div key={index} className={messageClass} >
                                <span>{tempUid} : </span>
                                {msg}
                            </div>
                        );
                    })}
                </div>


                <div className="input-group ">
                    <input type="text" className="form-control" value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type message..."
                    />
                    <button className="btn btn-outline-secondary" type="button" onClick={sendMessage} id="button-addon2">Send</button>
                </div>
            </div >
        </div>
    );
};

export default ChatRoom;
