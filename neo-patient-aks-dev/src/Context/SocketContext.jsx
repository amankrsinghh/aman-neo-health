// SocketContext.js
import { createContext, useContext, useEffect, useRef } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
            withCredentials: true
        });

        return () => socketRef.current.disconnect();
    }, []);

    return (
        <SocketContext.Provider value={socketRef.current}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
