import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';

// import bgImage from '../assets/bg-image.png';
import bgImage from '../assets/background.png';
// import bgImage from '../assets/bg-home.png';

function Home() {
    const [roomChoice, setRoomChoice] = useState('create');

    const handleButton = (choice) => {
        setRoomChoice(choice);
    }

    return (
        <div className="text-center " style={{ backgroundImage: `url(${bgImage})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
            <div className='row'>

                <div className='col col-5 ms-5 my-3 py-3' style={{ backgroundColor: '#0499e650' }} >
                    <h2>Share opinions Anonymously</h2>
                    <p className="lead">
                        <strong>
                            Create or join temporary chat rooms for anonymous conversations.
                        </strong>
                    </p>

                    <div className="container rounded my-2 py-2" style={{ backgroundColor: '#edefec' }}>
                        <button
                            className={`btn ${roomChoice === 'create' ? 'btn-dark' : 'btn-secondary'} ms-5 me-5 mt-2 mb-2`}
                            onClick={() => handleButton('create')}
                        >
                            Create Room
                        </button>
                        <button
                            className={`btn ${roomChoice === 'join' ? 'btn-dark' : 'btn-secondary'} ms-5 me-5 mt-2 mb-2`}
                            onClick={() => handleButton('join')}
                        >
                            Join Room
                        </button>

                        {roomChoice === 'create' && (
                            <div className='px-3'>
                                <CreateRoom />
                            </div>
                        )}

                        {roomChoice === 'join' && (
                            <JoinRoom />
                        )}
                    </div>
                </div>
            </div>
            <footer className='text-center' ><small>&copy; 2024 Chatonymous. All rights reserved.</small></footer>
        </div>
    );
}

export default Home;