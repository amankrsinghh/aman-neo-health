// GlobalCallListener.jsx
import { useEffect } from "react";
import { useSocket } from "../Context/SocketContext";
import { useCall } from "../Context/CallContext";

export default function GlobalCallListener() {
    const socket = useSocket();
    const { setIncomingCall } = useCall();

    useEffect(() => {
        if (!socket) return;

        socket.on("incoming-call", (data) => {
            setIncomingCall({
                ...data,
                startTime: null
            });
        });

        socket.on("call-ended", () => {
            setIncomingCall(null);
        });

        return () => {
            socket.off("incoming-call");
            socket.off("call-ended");
        };
    }, [socket]);

    return null;
}
