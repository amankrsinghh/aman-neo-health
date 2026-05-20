import { useCall } from "../Context/CallContext";


export default function CallModal() {
    const { incomingCall, callType, callerName } = useCall();

    if (!incomingCall) return null;

    return (
        <div className="call-modal">
            <h3>Incoming {callType} Call</h3>
            <p>{callerName}</p>

            <button className="btn accept">Accept</button>
            <button className="btn reject">Reject</button>

            <audio autoPlay loop src="/ringtone.mp3" />
        </div>
    );
}
