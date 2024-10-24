import React from 'react'
import logo from '../assets/chatonymous_logo.png'
import { useLocation, useParams } from 'react-router-dom'

const Nav = () => {
    const { roomName, roomPassword } = useParams();
    const location = useLocation();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-1">
            <div className="container-fluid">
                <a className="navbar-brand m-0 " style={{ fontFamily: 'Pacifico', fontSize: '1.5rem' }} href="/">
                    <img src={logo} alt="💬" width="30" height="30" className="d-inline-block align-text-center rounded m-1" />
                    Chatonymous
                </a>

                {location.pathname === `/chat-room/${roomName}/${roomPassword}` &&
                    <div className='d-flex me-0'>
                        <div className=''>
                            <p className='m-0'><b>Room Name:</b> {roomName}</p>
                            <p className='m-0'><b>Password:</b> {roomPassword}</p>
                        </div>
                    </div>
                }

            </div>
        </nav >
    )
}

export default Nav
