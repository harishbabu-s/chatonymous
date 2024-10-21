import React from 'react'
import logo from '../assets/chatonymous_logo.png'

const Nav = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-1">
            <div className="container-fluid">
                <a className="navbar-brand m-0 " style={{ fontSize: '1.5rem' }} href="/">
                    <img src={logo} alt="💬" width="30" height="30" className="d-inline-block align-text-center rounded m-1" />
                    Chatonymous
                </a>
            </div>
        </nav>
    )
}

export default Nav
