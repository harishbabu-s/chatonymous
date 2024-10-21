import React, { createContext, useContext, useState } from "react";

const NewRoomContext = createContext();
export const RoomProvider = ({ children }) => {
    const [roomName, setRoomName] = useState('');

    const changeRoomName = (name) => {
        setRoomName(name);
    }
    return (
        <NewRoomContext.Provider value={{ roomName, changeRoomName }}>
            {children}
        </NewRoomContext.Provider>
    );
};

export const useRoom = () => useContext(NewRoomContext);