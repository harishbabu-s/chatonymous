import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import ChatRoom from './components/ChatRoom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from './components/Nav';

function App() {
  return (
    <Router>
      <div className="container m-0 p-0" style={{ height: '100vh' }}>
        <Nav />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/chat-room/:roomName/:passkey" element={<ChatRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;