// Chat.jsx — Hospital Panel
// ✅ Call logic NAHI hai yahan — useGlobalSocket hook handle karta hai
// ✅ socket aur startCall props se aate hain (HospitalLayout se)

import {
  faCircleXmark,
  faMicrophone,
  faPaperclip,
  faPaperPlane,
  faPen,
  faPhone,
  faPlusCircle,
  faSearch,
  faUsers,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import AudioWaveform from "../AudioWaveform";
import "../Chat.css";
import base_url from "../../baseUrl";
import { FaTrash } from "react-icons/fa6";
import { getSecureApiData, securePostData } from "../../Service/api";
import { Link, useNavigate } from "react-router-dom";

function Chat({ socket, startCall }) {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const myUser = JSON.parse(localStorage.getItem("user"));
  const myUserId = myUser?.id;
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const recordTimerRef = useRef(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const selectedChatRef = useRef(null);
  const [newUser, setNewUser] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [groupData, setGroupData] = useState({
    name: "",
    participants: [],
    image: "",
    createdBy: myUserId,
  });
  const [newUsers, setNewUsers] = useState([]);
  const [nameOrId, setNameOrId] = useState("");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [typingUser, setTypingUser] = useState(false);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);

  const SERVER_BASE_URL = base_url;

  // ─── Keep selectedChat in ref ────────────────────────────────
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  // ─── File select ─────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // ─── Upload audio ─────────────────────────────────────────────
  const uploadAudio = async (file) => {
    if (!selectedChat || !socket) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/chat/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    socket.emit("send-message", {
      toUserId: selectedChat.participants[0]._id,
      conversationId: selectedChat._id,
      message: "",
      file: { ...res.data.file, isAudio: true },
    });

    setMessages((prev) => [
      ...prev,
      {
        sender: { _id: myUserId },
        file: { ...res.data.file, isAudio: true },
        createdAt: new Date(),
      },
    ]);
  };

  // ─── Recording toggle ─────────────────────────────────────────
  const toggleRecording = async () => {
    if (recording) {
      mediaRecorderRef.current.stop();
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
      setRecording(false);
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      setRecordedAudio(audioBlob);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
    setRecordSeconds(0);
    recordTimerRef.current = setInterval(() => {
      setRecordSeconds((s) => s + 1);
    }, 1000);
  };

  // ─── Socket: messaging listeners only ───────────────────────
  // ⚠️ Call listeners yahan NAHI hain — useGlobalSocket handle karta hai
  useEffect(() => {
    if (!socket) return;

    const onReceiveMessage = (msg) => {
      if (!msg.conversationId) return;
      if (msg.sender?._id === myUserId || msg.senderId === myUserId) return;
      const currentChat = selectedChatRef.current;

      if (currentChat && msg.conversationId === currentChat._id) {
        setMessages((prev) => [...prev, msg]);
      } else {
        setChatList((prev) =>
          prev.map((chat) =>
            chat._id === msg.conversationId
              ? {
                ...chat,
                unreadCount: (chat.unreadCount || 0) + 1,
                lastMessage: msg.message || "📎 Attachment",
              }
              : chat
          )
        );
      }
    };

    const onTyping = () => setTypingUser(true);
    const onStopTyping = () => setTypingUser(false);

    socket.on("receive-message", onReceiveMessage);
    socket.on("user-typing", onTyping);
    socket.on("user-stop-typing", onStopTyping);

    return () => {
      socket.off("receive-message", onReceiveMessage);
      socket.off("user-typing", onTyping);
      socket.off("user-stop-typing", onStopTyping);
    };
  }, [socket]);

  // ─── Scroll to bottom ─────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Load conversations ───────────────────────────────────────
  const fetchConversations = async () => {
    const res = await getSecureApiData(`api/hospital/conversations?page=${page}&limit=20`);
    if (res.success) {
      setChatList(prev => [...prev, ...res.data]);
      setTotalPages(res.totalPages);
    } else {
      toast.error(res.message);
      navigate(-1);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [page]);

  // ─── Open chat ────────────────────────────────────────────────
  const openChat = async (chat) => {
    setSelectedChat(chat);
    setChatList((prev) =>
      prev.map((c) => (c._id === chat._id ? { ...c, unreadCount: 0 } : c))
    );
    const res = await api.get(`/chat/messages/${chat._id}`);
    setMessages(res.data.data);
    if (socket) socket.emit("join-conversation", chat._id);
  };

  // ─── Send message ──────────────────────────────────────────────
  const sendMessage = async () => {
    console.log("object", message, selectedChat, socket)
    if (!selectedChat || !socket) return;
    if (recordedAudio) {
      const audioFile = new File([recordedAudio], `audio-${Date.now()}.webm`, {
        type: "audio/webm",
      });
      await uploadAudio(audioFile);
      setRecordedAudio(null);
      return;
    }

    if (previewFile) {
      const formData = new FormData();
      formData.append("file", previewFile);
      const res = await api.post("/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      socket.emit("send-message", {
        toUserId: selectedChat.participants[0]._id,
        conversationId: selectedChat._id,
        message: message || "",
        file: res.data.file,
      });
      setPreviewFile(null);
      setPreviewUrl(null);
      setMessage("");
      return;
    }

    if (!message.trim()) return;

    socket.emit("send-message", {
      toUserId: selectedChat.participants[0]._id,
      conversationId: selectedChat._id,
      message,
    });

    setMessages((prev) => [
      ...prev,
      { sender: { _id: myUserId }, message, createdAt: new Date() },
    ]);
    setMessage("");
  };

  // ─── Start chat with new user ──────────────────────────────────
  const startChatWithUser = async (user) => {
    const res = await api.post("/chat/create", { userId: user._id });
    const conversation = res.data.data;
    setSearchText("");
    setSearchUsers([]);
    setSelectedChat(conversation);
    const msgRes = await api.get(`/chat/messages/${conversation._id}`);
    setMessages(msgRes.data.data);
    setChatList((prev) => {
      const exists = prev.find((c) => c._id === conversation._id);
      return exists ? prev : [conversation, ...prev];
    });
  };

  // ─── Group helpers ─────────────────────────────────────────────
  const handleGroupChange = (event) => {
    const { name } = event.target;
    let value = event.target.value;
    if (name === "users") {
      const options = event.target.options;
      const selectedUsers = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) selectedUsers.push(options[i].value);
      }
      value = selectedUsers;
    }
    if (name === "image") value = event.target.files[0];
    setGroupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveUser = (index) => {
    const updatedUsers = [...groupData.participants];
    updatedUsers.splice(index, 1);
    setGroupData((prev) => ({ ...prev, participants: updatedUsers }));
  };

  const handleUserSearch = async (value) => {
    setNewUser(value);
    if (value.length === 12) {
      try {
        setLoadingUsers(true);
        const res = await getSecureApiData(`api/comman/search?q=${value}`);
        if (res.success) setSearchResults(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingUsers(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectUser = (user) => {
    const alreadyExists = groupData.participants.find((item) => item._id === user._id);
    if (alreadyExists) return;
    setGroupData((prev) => ({
      ...prev,
      participants: [...prev.participants, user],
    }));
    setNewUser("");
    setSearchResults([]);
  };

  const groupSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", groupData.name);
    formData.append("createdBy", groupData.createdBy);
    formData.append("image", groupData.image);
    let participantIds = groupData.participants.map((user) => user._id);
    if (!participantIds.includes(groupData.createdBy)) {
      participantIds.push(groupData.createdBy);
    }
    formData.append("participants", JSON.stringify(participantIds));
    try {
      const result = await securePostData("api/comman/create-group", formData);
      if (result.success) {
        setPage(1);
        toast.success("Group created successfully");
        setGroupData({ name: "", participants: [], image: "", createdBy: myUserId });
        document.getElementById("closeGroupModal").click();
      } else {
        toast.error("Failed to create group");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  // ─── JSX ───────────────────────────────────────────────────────
  return (
    <>
      <div className="main-content flex-grow-1 p-3 overflow-auto">
        <div className="row">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="innr-title mb-2">Chat</h3>
            </div>
          </div>
        </div>

        <div className="row">
          {/* LEFT SIDEBAR */}
          <div className="col-lg-3 pe-lg-0 mb-3">
            <div className="chat-left-usr-bx position-relative">
              <div className="add-chat px-3 py-2 z-1">
                <button
                  className="nw-thm-btn px-3"
                  data-bs-toggle="modal"
                  data-bs-target="#new-Chat"
                >
                  <FontAwesomeIcon icon={faPlusCircle} />
                </button>
              </div>

              <div>
                <h6>Message</h6>
                <div className="custom-frm-bx d-flex align-items-center mb-3 gap-2">
                  <input
                    type="text"
                    className="form-control px-5"
                    placeholder="Search user name or id..."
                    value={searchText}
                    onChange={async (e) => {
                      const value = e.target.value;
                      setSearchText(value);
                      if (value.length < 2) { setSearchUsers([]); return; }
                      const res = await api.get(`/comman/search?q=${value}`);
                      setSearchUsers(res.data.data);
                    }}
                  />
                  <div className="chat-search-bx">
                    <a className="chat-search-btn">
                      <FontAwesomeIcon icon={faSearch} />
                    </a>
                  </div>
                  <button className="nw-thm-btn" data-bs-toggle="modal" data-bs-target="#new-Group">
                    <FontAwesomeIcon icon={faUsers} />
                  </button>
                </div>

                {searchUsers.length > 0 && (
                  <div className="search-user-results">
                    {searchUsers.map((user) => (
                      <div
                        key={user._id}
                        className="chat-usr-card d-flex align-items-center gap-3"
                        onClick={() => startChatWithUser(user)}
                      >
                        <img
                          width={50} height={50}
                          src={user?.image ? `${base_url}/${user?.image}` : "/profile.png"}
                          alt="User"
                        />
                        <div className="chat-usr-info">
                          <h5>{user.name}</h5>
                          <small>{user.email}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {chatList.map((chat) => (
                  <div
                    key={chat._id}
                    className="chat-usr-card nw-chat-usr-card"
                    onClick={() => openChat(chat)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="chat-usr-avatr-crd">
                        <div className="chat-usr-avatr-bx">
                          <img
                            src={chat?.image || "/profile.png"}
                            alt=""
                          />
                        </div>
                        <div className="chat-usr-info">
                          <h5>{chat?.type === "group" ? chat.name : chat.participants[0]?.name}</h5>
                          <p>{chat.lastMessage}</p>
                        </div>
                      </div>
                      {chat.unreadCount > 0 && (
                        <div className="chat-count-bx me-lg-3">
                          <span className="chat-count-title">{chat.unreadCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {totalPages > page && (
                  <div className="text-end">
                    <button
                      onClick={() => setPage(page + 1)}
                      style={{ color: "#00B4B5" }}
                    // className="nw-thm-btn"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT CHAT */}
          {selectedChat?.participants?.[0] ? (
            <div className="col-lg-9 ps-lg-0 mb-3">
              <div className="right-chat-card chat-tp-header">
                <div className="lab-tp-title patient-bio-tab d-flex align-items-center justify-content-between py-2">
                  <div className="chat-usr-avatr-crd">
                    <div className="chat-usr-avatr-bx nw-chat-add-live">
                      <img
                        src={selectedChat?.image || "/profile.png"}
                        alt=""
                      />
                    </div>
                    <div className="chat-usr-info">
                      <h5 className="mb-0">
                        {selectedChat?.type === "group"
                          ? selectedChat?.name
                          : selectedChat?.participants[0]?.name || "Select Chat"}
                      </h5>
                      <p>
                        {selectedChat?.type === "group" &&
                          selectedChat?.participants?.map((p) => p.name).join(", ")}
                      </p>
                    </div>
                  </div>

                  {/* ✅ Call buttons — startCall global hook se aata hai */}
                  <div className="add-nw-bx d-flex gap-3">
                    <button
                      className="text-black calling-btn"
                      onClick={() => startCall("voice", selectedChat)}
                    >
                      <FontAwesomeIcon icon={faPhone} color="#00b5b5" />
                    </button>
                    <button
                      className="text-black calling-btn"
                      onClick={() => startCall("video", selectedChat)}
                    >
                      <FontAwesomeIcon icon={faVideo} color="#00b5b5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="all-chating-content-bx">
                  <div className="chat-container">
                    {messages.map((msg, i) => {
                      const isMe = msg.sender._id === myUserId;
                      return (
                        <div
                          key={i}
                          className={`d-flex align-items-start mb-4 ${isMe ? "justify-content-end" : ""}`}
                        >
                          <div>
                            <div className={`chat-bubble ${isMe ? "nw-right" : "nw-left"}`}>
                              {!isMe && selectedChat?.type === "group" && (
                                <p className="mb-0 fw-bold">{msg.sender?.name}</p>
                              )}
                              {msg.message && (
                                <p className={isMe ? "text-white" : ""}>{msg.message}</p>
                              )}
                              {msg.file && (
                                msg.file.type?.startsWith("audio/") ? (
                                  <audio
                                    controls
                                    src={`${SERVER_BASE_URL}${msg.file.url}`}
                                    style={{ width: "240px" }}
                                  />
                                ) : (
                                  <img
                                    src={`${SERVER_BASE_URL}${msg.file.url}`}
                                    alt={msg.file.name}
                                    style={{ maxWidth: "220px", borderRadius: "8px", cursor: "pointer" }}
                                    onClick={() => window.open(`${SERVER_BASE_URL}${msg.file.url}`, "_blank")}
                                  />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {typingUser && <p className="typing-text">Typing...</p>}
                    <div ref={bottomRef} />
                  </div>

                  {/* Input */}
                  <div>
                    {recording && (
                      <div className="recording-indicator mb-2">
                        <span className="text-danger fw-bold">🔴 Recording… {recordSeconds}s</span>
                        <small className="d-block text-muted">Tap mic to stop</small>
                      </div>
                    )}

                    {recordedAudio && (
                      <div className="audio-preview mb-2">
                        <small className="text-success d-block mb-1">🎧 Audio ready to send</small>
                        <AudioWaveform audioBlob={recordedAudio} />
                        <button
                          className="btn btn-sm btn-outline-danger mt-1"
                          onClick={() => setRecordedAudio(null)}
                        >
                          ❌ Cancel Audio
                        </button>
                      </div>
                    )}

                    <div className="custom-frm-bx mb-0">
                      <input
                        type="text"
                        style={{ paddingLeft: "90px", paddingRight: "70px" }}
                        className="form-control"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      />

                      <div className="chat-papperclip-bx">
                        <button
                          type="button"
                          className="papperclip-btn"
                          onClick={() => fileInputRef.current.click()}
                        >
                          <FontAwesomeIcon icon={faPaperclip} />
                        </button>
                        <button
                          type="button"
                          className={`mic-btn ${recording ? "recording" : ""}`}
                          onClick={toggleRecording}
                        >
                          {recording ? "⏹️" : <FontAwesomeIcon icon={faMicrophone} color="#00B4B5" />}
                        </button>
                      </div>

                      {previewUrl && (
                        <div className="image-preview mb-2">
                          <img
                            src={previewUrl}
                            alt="preview"
                            style={{ maxWidth: "200px", borderRadius: "8px", display: "block", marginBottom: "5px" }}
                          />
                          <small className="text-muted">🖼 Image ready to send</small>
                          <button
                            className="btn btn-sm btn-outline-danger mt-1"
                            onClick={() => { setPreviewFile(null); setPreviewUrl(null); }}
                          >
                            ❌ Remove
                          </button>
                        </div>
                      )}

                      <input type="file" hidden ref={fileInputRef} onChange={handleFileSelect} />

                      <div className="chat-papper-plane-bx">
                        <button className="chat-papper-plane-btn" onClick={sendMessage}>
                          <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-lg-9 ps-lg-0 mb-3 d-flex align-items-center justify-content-center">
              <div className="text-center text-muted">
                <img src="/chat.png" alt="Select chat" style={{ width: "180px", opacity: 0.6 }} />
                <p className="mt-3">👈 Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>

        <div className="text-end">
          <Link to={-1} className="nw-thm-btn rounded-3 outline">Go Back</Link>
        </div>
      </div>

      {/* New Group Modal */}
      <div className="modal step-modal" id="new-Group" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content rounded-0">
            <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
              <h6 className="heading-grad fz-24 mb-0">New Group</h6>
              <button type="button" id="closeGroupModal" data-bs-dismiss="modal" aria-label="Close" style={{ color: "rgba(239, 0, 0, 1)" }}>
                <FontAwesomeIcon icon={faCircleXmark} />
              </button>
            </div>
            <form className="modal-body px-4 pb-5" onSubmit={groupSubmit}>
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <p className="pt-2">Group image</p>
                  <div className="add-deprtment-pic main-user-picture position-relative">
                    {groupData.image ? (
                      <img src={URL.createObjectURL(groupData.image)} alt="group" />
                    ) : (
                      <img src="/profile.png" alt="default" />
                    )}
                    <label htmlFor="profileImageInput" className="profile-edit-icon">
                      <FontAwesomeIcon icon={faPen} />
                    </label>
                    <input type="file" name="image" id="profileImageInput" onChange={handleGroupChange} className="d-none" />
                  </div>

                  <div className="custom-frm-bx mt-3">
                    <label>Group Name</label>
                    <input className="form-control" name="name" value={groupData.name} onChange={handleGroupChange} required />
                  </div>

                  <label className="mt-3">User Id</label>
                  <div className="d-flex custom-frm-bx position-relative">
                    <input
                      className="form-control"
                      value={newUser}
                      onChange={(e) => handleUserSearch(e.target.value)}
                      placeholder="Enter 12 digit unique id"
                      maxLength={12}
                    />
                  </div>

                  {loadingUsers && <small>Searching...</small>}
                  {searchResults.length > 0 && (
                    <div className="search-dropdown">
                      {searchResults.map((user) => (
                        <div
                          key={user._id}
                          className="search-item"
                          onClick={() => handleSelectUser(user)}
                          style={{ cursor: "pointer", padding: "5px" }}
                        >
                          {user.name}
                        </div>
                      ))}
                    </div>
                  )}

                  <h5 className="mt-3">Users</h5>
                  {groupData.participants.map((user, index) => (
                    <div key={index} className="d-flex custom-frm-bx mb-2">
                      <input className="form-control" value={user?.name} readOnly />
                      <button type="button" onClick={() => handleRemoveUser(index)}>
                        <FaTrash color="red" />
                      </button>
                    </div>
                  ))}

                  <div className="mt-3">
                    <button type="submit" className="nw-thm-btn w-100">Submit</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      <div className="modal step-modal" id="new-Chat" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content rounded-0">
            <div className="d-flex align-items-center justify-content-between border-bottom py-3 px-4">
              <h6 className="heading-grad fz-24 mb-0">New Chat</h6>
              <button type="button" data-bs-dismiss="modal" aria-label="Close" style={{ color: "rgba(239, 0, 0, 1)" }}>
                <FontAwesomeIcon icon={faCircleXmark} />
              </button>
            </div>
            <form className="modal-body px-4 pb-5">
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="custom-frm-bx mt-3">
                    <label>User Name or id</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={nameOrId}
                      onChange={(e) => setNameOrId(e.target.value)}
                    />
                  </div>

                  {newUsers.length > 0 && (
                    <ul className="dropdown">
                      {newUsers.map((user) => (
                        <div
                          key={user._id}
                          className="dropdown-item prescription-item d-flex align-items-center gap-3"
                          onClick={() => startChatWithUser(user)}
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          style={{ cursor: "pointer", padding: "5px" }}
                        >
                          <img
                            width={50} height={50}
                            src={user.image ? `${base_url}/${user.image}` : "/profile.png"}
                            alt=""
                          />
                          <div className="d-flex flex-column">
                            <span style={{ fontWeight: "bold" }}>{user.name}</span>
                            {user.nh12 || user?._id?.slice(-6)}
                          </div>
                        </div>
                      ))}
                    </ul>
                  )}

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={async () => {
                        if (nameOrId.length > 4) {
                          const res = await getSecureApiData(`api/comman/search?q=${nameOrId}`);
                          setNewUsers(res.data || []);
                        } else {
                          setSearchResults([]);
                        }
                      }}
                      className="nw-thm-btn w-100"
                    >
                      Find
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;