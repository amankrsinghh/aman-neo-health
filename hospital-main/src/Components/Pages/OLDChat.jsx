import {
  faPaperclip,
  faPaperPlane,
  faPhone,
  faSearch,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import api from "../../api/api";

function Chat() {
  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [typingUser, setTypingUser] = useState(false);
  const socketRef = useRef(null);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  //Call
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingCandidatesRef = useRef([]);

  const [incomingCall, setIncomingCall] = useState(null);
  const [callType, setCallType] = useState(null);
  const [callActive, setCallActive] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const myUser = JSON.parse(localStorage.getItem("user"));
  const myUserId = myUser?.id;
  const SERVER_BASE_URL = "http://localhost:4000";

  //Call
  const initPeerConnection = (toUserId) => {
    pcRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pcRef.current.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current.emit("ice-candidate", {
          toUserId,
          candidate: e.candidate,
        });
      }
    };

    pcRef.current.ontrack = (e) => {
      const stream = e.streams[0];

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      } else {
        const interval = setInterval(() => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
            clearInterval(interval);
          }
        }, 100);
      }
    };
  };

  const startCall = async (type) => {
    if (!selectedChat) return;

    setCallType(type);
    initPeerConnection(selectedChat.participants[0]._id);

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === "video",
    });

    localStreamRef.current = stream;
    stream.getTracks().forEach((t) => pcRef.current.addTrack(t, stream));

    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);

    socketRef.current.emit("call-user", {
      toUserId: selectedChat.participants[0]._id,
      callType: type,
      offer,
    });
  };

  const acceptCall = async () => {
    initPeerConnection(incomingCall.fromUserId);

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: callType === "video",
    });

    localStreamRef.current = stream;
    stream.getTracks().forEach((t) => pcRef.current.addTrack(t, stream));

    await pcRef.current.setRemoteDescription(incomingCall.offer);
    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);

    socketRef.current.emit("answer-call", {
      toUserId: incomingCall.fromUserId,
      answer,
    });

    setIncomingCall(null);
    setCallActive(true);
  };

  const endCallCleanup = () => {
    pcRef.current?.close();
    pcRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    setCallActive(false);
    setIncomingCall(null);
  };

  const rejectCall = () => {
    socketRef.current.emit("reject-call", {
      toUserId: incomingCall.fromUserId,
    });
    endCallCleanup();
  };

  const endCall = () => {
    socketRef.current.emit("end-call");
    endCallCleanup();
  };

  // ================= SOCKET INIT =================
  useEffect(() => {
    socketRef.current = io("http://localhost:4000", {
      auth: { token: localStorage.getItem("token") },
    });

    socketRef.current.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("user-typing", () => setTypingUser(true));
    socketRef.current.on("user-stop-typing", () => setTypingUser(false));

    //Call
    socketRef.current.on("incoming-call", ({ fromUserId, offer, callType }) => {
      setIncomingCall({ fromUserId, offer });
      setCallType(callType);
    });

    socketRef.current.on("call-answered", async ({ answer }) => {
      await pcRef.current.setRemoteDescription(answer);
      pendingCandidatesRef.current.forEach((c) =>
        pcRef.current.addIceCandidate(c)
      );
      pendingCandidatesRef.current = [];
      setCallActive(true);
    });

    socketRef.current.on("ice-candidate", async (candidate) => {
      if (pcRef.current?.remoteDescription) {
        await pcRef.current.addIceCandidate(candidate);
      } else {
        pendingCandidatesRef.current.push(candidate);
      }
    });

    socketRef.current.on("call-rejected", () => {
      endCallCleanup();
      alert("Call rejected");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // ================= LOAD CHAT LIST =================
  useEffect(() => {
    api.get("/chat/conversations").then((res) => {
      setChatList(res.data.data);
    });
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);


  useEffect(() => {
  if (callActive || incomingCall) {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }
}, [callActive, incomingCall]);


useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);


  // ================= OPEN CHAT =================
  const openChat = async (chat) => {
    setSelectedChat(chat);
    const res = await api.get(`/chat/messages/${chat._id}`);
    setMessages(res.data.data);
  };

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    socketRef.current.emit("send-message", {
      toUserId: selectedChat.participants[0]._id,
      message,
    });

    setMessages((prev) => [
      ...prev,
      { sender: { _id: myUserId }, message, createdAt: new Date() },
    ]);

    setMessage("");
  };

  // ================= FILE UPLOAD =================
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedChat) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/chat/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    socketRef.current.emit("send-message", {
      toUserId: selectedChat.participants[0]._id,
      message: "",
      file: res.data.file,
    });

    setMessages((prev) => [
      ...prev,
      { sender: { _id: myUserId }, file: res.data.file, createdAt: new Date() },
    ]);
  };

  return (
    <>
      <div className="main-content flex-grow-1 p-3 overflow-auto">
        <div className="row">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="innr-title mb-2"> Chat</h3>
            </div>
          </div>
        </div>

        <div className="row">
          {/* LEFT SIDEBAR */}
          <div className="col-lg-3 pe-lg-0 mb-3">
            <div className="chat-left-usr-bx">
              <div>
                <h6>Message</h6>

                {chatList.map((chat) => (
                  <a href="javascript:void(0)" key={chat._id}>
                    <div
                      className="chat-usr-card nw-chat-usr-card"
                      onClick={() => openChat(chat)}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="chat-usr-avatr-crd">
                          <div className="chat-usr-avatr-bx">
                            <img src="/chat-logo.jpg" alt="" />
                          </div>
                          <div className="chat-usr-info">
                            <h5>{chat.participants[0]?.name}</h5>
                            <p>{chat.lastMessage}</p>
                          </div>
                        </div>

                        {chat.unreadCount > 0 && (
                          <div className="chat-count-bx me-lg-3">
                            <span className="chat-count-title">
                              {chat.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CHAT */}
          <div className="col-lg-9 ps-lg-0 mb-3">
            <div className="right-chat-card chat-tp-header">
              <div className="lab-tp-title patient-bio-tab d-flex align-items-center justify-content-between py-2">
                <div className="chat-usr-avatr-crd">
                  <div className="chat-usr-avatr-bx nw-chat-add-live">
                    <img src="/chat-logo.jpg" alt="" />
                  </div>
                  <div className="chat-usr-info">
                    <h5 className="mb-0">
                      {selectedChat?.participants[0]?.name || "Select Chat"}
                    </h5>
                  </div>
                </div>

                <div className="add-nw-bx d-flex gap-3">
                  <button
                    className="text-black calling-btn"
                    onClick={() => startCall("voice")}
                  >
                    <FontAwesomeIcon icon={faPhone} />
                  </button>
                  <button
                    className="text-black calling-btn"
                    onClick={() => startCall("video")}
                  >
                    <FontAwesomeIcon icon={faVideo} />
                  </button>
                </div>
              </div>

              <div className="all-chating-content-bx">
                <div className="chat-container">
                  {messages.map((msg, i) => {
                    const isMe = msg.sender._id === myUserId;
                    return (
                      <div
                        key={i}
                        className={`d-flex align-items-start mb-4 ${
                          isMe ? "justify-content-end" : ""
                        }`}
                      >
                        <div>
                          <div
                            className={`chat-bubble ${
                              isMe ? "nw-right" : "nw-left"
                            }`}
                          >
                            {msg.file ? (
                              <img
                                src={`${SERVER_BASE_URL}${msg.file.url}`}
                                alt={msg.file.name}
                                style={{
                                  maxWidth: "220px",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  window.open(
                                    `${SERVER_BASE_URL}${msg.file.url}`,
                                    "_blank"
                                  )
                                }
                              />
                            ) : (
                              msg.message
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  

                  {typingUser && <p className="typing-text">Typing...</p>}
                  <div ref={bottomRef} />
                </div>

                <div>
                  <div className="custom-frm-bx mb-0">
                    <input
                      type="text"
                      className="form-control px-5"
                      placeholder="Digite a mensagem"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />

                    <div
                      className="chat-papperclip-bx"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <button className="papperclip-btn">
                        <FontAwesomeIcon icon={faPaperclip} />
                      </button>
                    </div>

                    <input
                      type="file"
                      hidden
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />

                    <div className="chat-papper-plane-bx">
                      <button
                        className="chat-papper-plane-btn"
                        onClick={sendMessage}
                      >
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {incomingCall && (
        <div className="call-popup">
          <h4>Incoming {callType} call</h4>
          <button onClick={acceptCall}>Accept</button>
          <button onClick={rejectCall}>Reject</button>
          <audio autoPlay loop src="/ringtone.mp3" />
        </div>
      )}

      {callActive && (
        <div className="call-screen">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{ width: "150px" }}
          />

          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: "300px" }}
          />
          <button onClick={endCall}>End Call</button>
        </div>
      )}
    </>
  );
}

export default Chat;
