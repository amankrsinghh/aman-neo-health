import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import base_url from "../baseUrl";

const CallContext = createContext();
export const useCall = () => useContext(CallContext);

export function CallProvider({ children }) {
    const socketRef = useRef(null);

    const [incomingCall, setIncomingCall] = useState(null);
    const [callType, setCallType] = useState(null);
    const [callerName, setCallerName] = useState(null);
    const [callerId, setCallerId] = useState(null);

    useEffect(() => {
        socketRef.current = io(base_url, {
            auth: { token: localStorage.getItem("token") }
        });
        socketRef.current.on("incoming-call", ({ fromUserId, offer, callType, name }) => {
            setIncomingCall({ fromUserId, offer });
            setCallType(callType);
            setCallerName(name);
            setCallerId(fromUserId);
        });
        socketRef.current.on("call-ended", () => {
            setIncomingCall(null);
        });

        return () => socketRef.current.disconnect();
    }, []);

    return (
        <CallContext.Provider value={{
            socket: socketRef,
            incomingCall,
            setIncomingCall,
            callType,
            callerName,
            callerId
        }}>
            {children}
        </CallContext.Provider>
    );
}
