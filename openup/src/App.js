import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import ChatRoom from './components/ChatRoom';
import 'bootstrap/dist/css/bootstrap.min.css';
import DynamicGrid from './components/testFeat';


function App() {
  const itemss = ["FF0000", "00FF00", "0000FF", "FFFF00", "FF00FF", "00FFFF", "000000", "800000",
    "800080", "808080", "C0C000", "C0C0C0", "400000", "000040",
    "404000", "004040", "404040", "002000", "000020",
    "006000", "006060", "A0A000", "A0A0A0",]
  return (
    <Router>
      <div className="container m-0 p-0" style={{ height: '100vh' }}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/test" element={<DynamicGrid items={itemss} />} />
          <Route path="/chat-room/:roomName/:roomPassword" element={<ChatRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;