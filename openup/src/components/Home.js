import React, { useState } from 'react';

import Nav from './Nav';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';

// import bgImage from '../assets/bg-image.png';
// import bgImage from '../assets/bg-repeat-home.png';
// import bgImage from '../assets/bg-repeat.png';
// import bgImage from '../assets/background.png';
// import bgImage from '../assets/bg-home.png';
import bgImage from '../assets/bg-fit-home.png';

function Home() {
    const [roomChoice, setRoomChoice] = useState('create');

    const handleButton = (choice) => {
        setRoomChoice(choice);
    }

    return (
        <>
            <Nav />
            <div className="text-center container-fluid " style={{ backgroundImage: `url(${bgImage})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', minHeight: '100vh' }}>
                <div className='row justify-content-center py-sm-5'>
                    <div className=' col col-sm-10 col-md-5 mx-md-3 rounded bg-light' >
                        <h2 className='pt-3'>Share opinions Anonymously</h2>
                        <p className="lead">
                            <strong>
                                Create or join temporary chat rooms for anonymous conversations.
                            </strong>
                        </p>

                        <div className="container rounded my-2 py-2" style={{ backgroundColor: '#edefec' }}>
                            <button
                                className={`btn btn-sm mx-xs-12 mx-sm-5 mx-md-2 mx-lg-4 mx-xl-5 my-2 ${roomChoice === 'create' ? 'btn-dark' : 'btn-secondary'}`}
                                onClick={() => handleButton('create')}
                            >
                                Create Room
                            </button>
                            <button
                                className={`btn btn-sm mx-xs-12 mx-sm-5 mx-md-2 mx-lg-4 mx-xl-5 my-2 ${roomChoice === 'join' ? 'btn-dark' : 'btn-secondary'}`}
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
                    <div className=' col col-sm-10 col-md-5 mx-md-3 rounded' >

                    </div>
                </div>
                <footer className='fixed-bottom text-center bg-light' ><small>&copy; 2024 Chatonymous. All rights reserved.</small></footer>
            </div>
        </>
    );
}

export default Home;