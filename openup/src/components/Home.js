import { useEffect, useState } from 'react';
import axios from 'axios';


import Nav from './Nav';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';

// import bgImage from '../assets/bg-image.png';
// import bgImage from '../assets/bg-repeat-home.png';
// import bgImage from '../assets/bg-repeat.png';
// import bgImage from '../assets/background.png';
// import bgImage from '../assets/bg-home.png';
import bgImage from '../assets/bg-fit-home.png';
import Samples from './Samples';
import config from '../config';

function Home() {
    const [roomChoice, setRoomChoice] = useState('create');

    async function server() {
        try {
            axios.get(`${config.apiUrl}/`)
                .then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
        }
    }
    const handleButton = (choice) => {
        setRoomChoice(choice);
    }

    useEffect(() => {
        // server();
    }, []);

    return (
        <>
            <Nav />
            <div className="text-center container-fluid " style={{ backgroundImage: `url(${bgImage})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', minHeight: '100vh' }}>
                <div className='row justify-content-center py-sm-5'>
                    <div className=' col col-10 col-md-9 col-lg-5 mx-md-3 mx-lg-3 mt-5 mt-sm-0' >
                        <div className='bg-light rounded'>
                            <h2 className='pt-3'>Share opinions Anonymously</h2>
                            <p className="lead">
                                <strong>
                                    Create or join temporary chat rooms for anonymous conversations.
                                </strong>
                            </p>

                            <div className=" rounded m-3 py-2" style={{ backgroundColor: '#edefec' }}>
                                <button
                                    className={`btn btn-sm mx-xs-1 mx-sm-5 mx-md-5 mx-lg-4 mx-xl-5 my-2 ${roomChoice === 'create' ? 'btn-dark' : 'btn-secondary'}`}
                                    onClick={() => handleButton('create')}
                                >
                                    Create Room
                                </button>
                                <button
                                    className={`btn btn-sm mx-xs-1 mx-sm-5 mx-md-5 mx-lg-4 mx-xl-5 my-2 ${roomChoice === 'join' ? 'btn-dark' : 'btn-secondary'}`}
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
                    <div className=' col col-10 col-md-9 col-lg-5 mx-md-3 mx-lg-3 mt-2 mt-sm-0 rounded flex justify-center items-center'>
                        <Samples />
                    </div>
                </div>
                <footer className='fixed-bottom text-center bg-light' ><small>&copy; 2024 Chatonymous. All rights reserved.</small></footer>
            </div>
        </>
    );
}

export default Home;